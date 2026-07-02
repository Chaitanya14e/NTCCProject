import { spawn } from "child_process";
import { Video } from "../models/video.models.js";
import { Notification } from "../models/notification.models.js";

export const uploadVideo = async (req, res) => {

    try {

        console.log("Video received");

        const python = spawn(
            "python",
            [
                "./python/detect.py",
                req.file.path
            ]
        );

        console.log("Python process started");

        let output = "";

        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (data) => {
            console.log(
                "PYTHON ERROR:",
                data.toString()
            );
        });

        python.on("close", async () => {

            console.log("Python Output:", output);

            // FIXED: use "output" instead of undefined "stdout"
            const lines = output.trim().split('\n');
            const lastLine = lines[lines.length - 1];

            let result;
            try {
                result = JSON.parse(lastLine);
            } catch (err) {
                console.error("Failed to parse Python output. Raw output:", output);
                return res.status(500).json({
                    message: "Invalid JSON from Python script"
                });
            }

            try {
                const savedVideo = await Video.create({
                    fileName: req.file.filename,
                    status: result.status,
                    anomalyTime: result.time,
                    confidence: result.confidence,
                    framePath: result.frame
                });

                await Notification.create({
                    title:
                        result.status === "anomaly"
                            ? "Anomaly Detected"
                            : "Video Analyzed",

                    message:
                        result.status === "anomaly"
                            ? `${req.file.originalname} contains anomaly`
                            : `${req.file.originalname} is clean`,

                    type: result.status,
                    fileName: req.file.originalname,
                    confidence: result.confidence,
                    anomalyTime: result.time
                });

                return res.json(result);

            } catch (dbError) {
                console.error("Database error:", dbError);
                return res.status(500).json({
                    message: "Failed to save video/notification"
                });
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });

    }
};

export const getAllVideos = async (req, res) => {
    const videos = await Video.find();
    res.json(videos);
};