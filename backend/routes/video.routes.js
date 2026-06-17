import Router from "express"
import { upload } from "../middleware/multer.middleware.js";
import { uploadVideo,getAllVideos } from "../controllers/video.controller.js";
import { dashboardStats,anomalyVideos,cleanVideos } from "../controllers/dashboard.controller.js";
const router = Router();
router.post(
    "/upload",
    upload.single("video"),
    uploadVideo
)
router.get(
    "/dashboard",
    dashboardStats
)
router.get(
    "/anomalies",
    anomalyVideos
);

router.get(
    "/clean",
    cleanVideos
);
router.get(
    "/all",
    getAllVideos
)
export default router;