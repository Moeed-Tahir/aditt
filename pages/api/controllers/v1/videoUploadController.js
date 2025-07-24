import { Storage } from '@google-cloud/storage';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';

const storage = new Storage({
  projectId: 'aditt-app',
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || 'aditt-24@aditt-app.iam.gserviceaccount.com',
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const videoIntelligenceClient = new VideoIntelligenceServiceClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || 'aditt-24@aditt-app.iam.gserviceaccount.com',
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export const uploadAndAnalyzeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const file = req.file;
    const bucketName = 'aditt-video-tester';
    const fileName = `videos/${Date.now()}_${file.originalname}`;

    await storage.bucket(bucketName).file(fileName).save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    const gcsUri = `gs://${bucketName}/${fileName}`;
    const [operation] = await videoIntelligenceClient.annotateVideo({
      inputUri: gcsUri,
      features: ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION', 'EXPLICIT_CONTENT_DETECTION'],
    });

    const [result] = await operation.promise();

    const passed = evaluateVideo(result);
    console.log("Passed", passed);
    
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

  } catch (error) {
    console.error('Error in video processing:', error);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to process video",
      error: error.message
    });
  }
};

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
    }))
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
    worstCase
  };
}

function extractTopLabels(analysisResult, count = 5) {
  return analysisResult.annotationResults[0].segmentLabelAnnotations
    ?.sort((a, b) => b.segments[0].confidence - a.segments[0].confidence)
    ?.slice(0, count)
    ?.map(label => ({
      label: label.entity.description,
      confidence: label.segments[0].confidence
    })) || [];
}