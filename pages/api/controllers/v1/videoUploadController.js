import { S3Client, PutObjectCommand,GetObjectCommand,ListObjectsV2Command   } from "@aws-sdk/client-s3";
import { VideoIntelligenceServiceClient } from "@google-cloud/video-intelligence";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const videoIntelligenceClient = new VideoIntelligenceServiceClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || "aditt-24@aditt-app.iam.gserviceaccount.com",
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export const uploadAndAnalyzeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const file = req.file;
    const bucketName = process.env.S3_BUCKET_NAME || "aditt-video-tester";
    const fileName = `videos/${Date.now()}_${file.originalname}`;

    // ===============================
    // UPLOAD VIDEO TO S3
    // ===============================
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // S3 file URL
    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // ===============================
    // VIDEO INTELLIGENCE (OPTIONAL)
    // ===============================
    // Google Video Intelligence can only process GCS URIs,
    // so if you still want to analyze, you’d need to upload the file
    // to a temporary Google Cloud bucket. Currently, we skip analysis.
    /*
    const [operation] = await videoIntelligenceClient.annotateVideo({
      inputUri: gcsUri,
      features: ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION', 'EXPLICIT_CONTENT_DETECTION'],
    });

    const [result] = await operation.promise();

    const passed = evaluateVideo(result);
    
    return res.status(200).json({
      status: passed ? "PASSED" : "FAILED",
      videoId: fileName,
      analysis: {
        duration: `${result.annotationResults[0].segment.endTimeOffset.seconds}s`,
        labels: extractTopLabels(result),
        explicitContent: checkExplicitContent(result),
        violentContent: checkForViolentContent(result),
        shots: result.annotationResults[0].shotAnnotations.length
      },
      rawData: result
    });
    */

    // ===============================
    // UPLOAD-ONLY RESPONSE
    // ===============================
    return res.status(200).json({
      status: "UPLOADED",
      videoId: fileName,
      s3Url,
      message: "Video uploaded successfully (no analysis performed)",
    });

  } catch (error) {
    console.error("Error in video processing:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to process video",
      error: error.message,
    });
  }
};

export const streamVideoFromS3 = async (req, res) => {
  try {
    const { fileName } = req.body;
    const range = req.headers.range;

    if (!range) {
      console.warn("⚠️ Missing Range header — required for streaming.");
      return res.status(400).send("Requires Range header");
    }

    if (!fileName) {
      console.warn("⚠️ Missing fileName in request body.");
      return res.status(400).json({ message: "Missing fileName in request body" });
    }

    const bucket = process.env.S3_BUCKET_NAME;

    const key = fileName.startsWith("videos/") ? fileName : `videos/${fileName}`;

    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: key,
      MaxKeys: 1,
    });
    const listResponse = await s3.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.error(`❌ Video not found in bucket. Tried key: ${key}`);
      return res.status(404).json({
        message: `Video not found in bucket.`,
        keyAttempted: key,
      });
    }

    const videoParams = {
      Bucket: bucket,
      Key: key,
      Range: range,
    };

    const command = new GetObjectCommand(videoParams);
    const video = await s3.send(command);

    res.writeHead(206, {
      "Content-Range": video.ContentRange,
      "Accept-Ranges": "bytes",
      "Content-Length": video.ContentLength,
      "Content-Type": "video/mp4",
    });

    video.Body.pipe(res);

    video.Body.on("end", () => {
      console.log("✅ Finished sending current video chunk.\n");
    });

    video.Body.on("error", (err) => {
      console.error("❌ Stream error while piping video:", err);
    });
  } catch (error) {
    console.error("💥 Error streaming video:", error);

    if (error.Code === "NoSuchKey") {
      console.error(`❌ NoSuchKey: File not found for key: ${error.Key}`);
      return res.status(404).json({
        message: "Video not found in S3 bucket. Check the file name or key.",
        key: error.Key,
      });
    }

    return res.status(500).json({
      message: "Error streaming video",
      error: error.message,
    });
  }
};

// ========== Helper Functions (same as before) ==========

function evaluateVideo(analysisResult) {
  const { safe: isExplicitContentSafe } = checkExplicitContent(analysisResult);
  if (!isExplicitContentSafe) return false;

  const { hasViolentContent } = checkForViolentContent(analysisResult);
  if (hasViolentContent) return false;

  return true;
}

function checkForViolentContent(analysisResult) {
  const violentKeywords = [
    'blood', 'gore', 'violence', 'wound', 'injury', 'bleeding',
    'bloody', 'bloodshed', 'hemorrhage', 'gun', 'weapon', 'fight',
    'stab', 'shoot', 'murder', 'death', 'corpse'
  ];

  const violentLabels = analysisResult.annotationResults[0]?.segmentLabelAnnotations?.filter(
    label => {
      const description = label.entity.description.toLowerCase();
      return violentKeywords.some(keyword => description.includes(keyword)) &&
             label.segments[0].confidence > 0.5;
    }
  ) || [];

  return {
    hasViolentContent: violentLabels.length > 0,
    detectedLabels: violentLabels.map(label => ({
      label: label.entity.description,
      confidence: label.segments[0].confidence
    })),
  };
}

function checkExplicitContent(analysisResult) {
  if (!analysisResult.annotationResults[0]?.explicitAnnotation?.frames) {
    return { safe: true, worstCase: 'UNKNOWN' };
  }

  const frames = analysisResult.annotationResults[0].explicitAnnotation.frames;
  const worstCase = frames.reduce((worst, frame) => {
    const levels = ['VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'];
    return levels.indexOf(frame.pornographyLikelihood) > levels.indexOf(worst)
      ? frame.pornographyLikelihood
      : worst;
  }, 'VERY_UNLIKELY');

  return {
    safe: worstCase === 'VERY_UNLIKELY' || worstCase === 'UNLIKELY',
    worstCase,
  };
}

function extractTopLabels(analysisResult, count = 5) {
  return analysisResult.annotationResults[0].segmentLabelAnnotations
    ?.sort((a, b) => b.segments[0].confidence - a.segments[0].confidence)
    ?.slice(0, count)
    ?.map(label => ({
      label: label.entity.description,
      confidence: label.segments[0].confidence,
    })) || [];
}
