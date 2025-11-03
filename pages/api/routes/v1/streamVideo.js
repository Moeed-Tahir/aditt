import {
    streamVideoFromS3
} from "../../controllers/v1/videoUploadController";

export default async function handler(req, res) {
    const { action } = req.query;

    if (!action) {
        return res.status(400).json({ message: "Action parameter is required" });
    }

    try {
        if (req.method === "GET") {
            switch (action) {
                case "streamVideoFromS3":
                    return await streamVideoFromS3(req, res);
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
            code: "INTERNAL_SERVER_ERROR"
        });
    }
}