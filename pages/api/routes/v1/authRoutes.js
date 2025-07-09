import {
  signIn,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  deleteAccount,
  resendOTP,
  getProfile,
  verifyOTP,
  getAllUsers,
  signUp,
  requestAccountDeletion,
  getPendingDeletionRequests,
  rejectDeletionRequest,
  approveDeletionRequest,
  getAllUserDataAgainstId,
  getConsumerUser,
  getLatestUsers,
  getLatestPendingDeletionRequests,
  getAllConsumerUser,
  deleteAdvertiserUser,
  deleteConsumerUser
} from "../../controllers/v1/authControllers";

export default async function handler(req, res) {
  const { action } = req.query;

  if (!action) {
    return res.status(400).json({ message: "Action parameter is required" });
  }

  try {
    if (req.method === "POST") {
      switch (action) {
        case "verify-otp":
          return await verifyOTP(req, res);
        case "signUp":
          return await signUp(req, res);
        case "signin":
          return await signIn(req, res);
        case "forgot-password":
          return await forgotPassword(req, res);
        case "reset-password":
          return await resetPassword(req, res);
        case "resend-otp":
          return await resendOTP(req, res);
        case "getProfile":
          return await getProfile(req, res);
        case "getAllUsers":
          return await getAllUsers(req, res);
        case "requestAccountDeletion":
          return await requestAccountDeletion(req, res);
        case "getPendingDeletionRequests":
          return await getPendingDeletionRequests(req, res);
        case "rejectDeletionRequest":
          return await rejectDeletionRequest(req, res);
        case "approveDeletionRequest":
          return await approveDeletionRequest(req, res);
        case "getAllUserDataAgainstId":
          return await getAllUserDataAgainstId(req, res);
        case "deleteAccount":
          return await deleteAccount(req, res);
        case "getConsumerUser":
          return await getConsumerUser(req, res);
        case "getConsumerUser":
          return await getConsumerUser(req, res);
        case "getLatestUsers":
          return await getLatestUsers(req, res);
        case "getLatestPendingDeletionRequests":
          return await getLatestPendingDeletionRequests(req, res);
        case "getAllConsumerUser":
          return await getAllConsumerUser(req, res);
        case "deleteAdvertiserUser":
          return await deleteAdvertiserUser(req, res);
        case "deleteConsumerUser":
          return await deleteConsumerUser(req, res);
        default:
          return res.status(400).json({ message: "Invalid action parameter" });
      }
    }



    if (req.method === "PUT") {
      switch (action) {
        case "updateProfile":
          return await updateProfile(req, res);
        case "updatePassword":
          return await updatePassword(req, res);
        default:
          return res
            .status(400)
            .json({ message: "Invalid action parameter for PUT" });
      }
    }

    if (req.method === "DELETE") {
      switch (action) {
        default:
          return res
            .status(400)
            .json({ message: "Invalid action parameter for DELETE" });
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
