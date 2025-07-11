import { uploadAndAnalyzeVideo } from '../../controllers/v1/videoUploadController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { action } = req.query;

  if (!action) {
    return res.status(400).json({ message: "Action parameter is required" });
  }

  try {
    if (req.method === "POST") {
      switch (action) {
        case "upload":
          return new Promise((resolve, reject) => {
            upload.single('file')(req, res, (err) => {
              if (err) {
                return reject(err);
              }
              resolve(uploadAndAnalyzeVideo(req, res));
            });
          });
        
        default:
          return res.status(400).json({ message: "Invalid action parameter" });
      }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}