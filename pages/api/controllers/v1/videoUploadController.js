import { S3Client, PutObjectCommand,GetObjectCommand,ListObjectsV2Command,HeadObjectCommand,CompleteMultipartUploadCommand,UploadPartCommand,CreateMultipartUploadCommand} from "@aws-sdk/client-s3";
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
    const key = `videos/${Date.now()}_${file.originalname}`;

    const createUploadResp = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: file.mimetype,
      })
    );

    const uploadId = createUploadResp.UploadId;
    const chunkSize = 5 * 1024 * 1024;
    const parts = [];

    for (let start = 0, partNumber = 1; start < file.size; start += chunkSize, partNumber++) {
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.buffer.slice(start, end);

      const uploadPartResp = await s3.send(
        new UploadPartCommand({
          Bucket: bucketName,
          Key: key,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: chunk,
        })
      );

      parts.push({
        ETag: uploadPartResp.ETag,
        PartNumber: partNumber,
      });
    }

    await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      })
    );

    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.status(200).json({
      status: "UPLOADED",
      videoId: key,
      s3Url,
      message: "Video uploaded successfully in chunks",
    });

  } catch (error) {
    console.error("Multipart upload error:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to upload video in chunks",
      error: error.message,
    });
  }
};

export const streamVideoFromS3 = async (req, res) => {
  try {
    const { fileName } = req.query;
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

    const headCommand = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    let fileSize;
    try {
      const headResponse = await s3.send(headCommand);
      fileSize = headResponse.ContentLength;
    } catch (error) {
      console.error("❌ Error getting file info:", error);
      return res.status(404).json({
        message: "Video not found in S3 bucket",
        keyAttempted: key,
      });
    }

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: `bytes=${start}-${end}`,
    });

    const response = await s3.send(getObjectCommand);
    
    response.Body.pipe(res);

  } catch (error) {
    console.error("💥 Error streaming video:", error);
    
    if (error.name === "NoSuchKey") {
      return res.status(404).json({
        message: "Video not found in S3 bucket",
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
