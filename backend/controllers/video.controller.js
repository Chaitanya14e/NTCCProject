import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { Video } from "../models/video.models.js";
import { Notification } from "../models/notification.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadVideo = async (req, res) => {

    try {

        console.log("Video received");

        const formData = new FormData();

        formData.append(
            "video",
            fs.createReadStream(req.file.path)
        );

        const response = await axios.post(
            "http://127.0.0.1:8000/analyze",
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        const result = response.data;

            // Upload original video AFTER Python finishes
            const uploadedVideo = await uploadOnCloudinary(
                req.file.path,
                "video",
                "NTCC/videos"
            );
            console.log("Uploaded Video Object:", uploadedVideo);

            // Upload frame if available
            let uploadedFrame = null;

            if (result.frame) {

                uploadedFrame = await uploadOnCloudinary(
                    "." + result.frame,
                    "image",
                    "NTCC/frames"
                );

                result.frame = uploadedFrame?.secure_url;
            }
            console.log("Uploaded Frame Object:", uploadedFrame);

            try {

                await Video.create({

                    fileName: req.file.originalname,

                    status: result.status,

                    anomalyTime: result.time,

                    confidence: result.confidence,

                    framePath: result.frame,

                    videoPath: uploadedVideo?.secure_url

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

                console.error("Database Error:", dbError);

                return res.status(500).json({
                    message: "Failed to save data"
                });

            }

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: error.message
        });

    }

};

export const getAllVideos = async (req, res) => {

    try {

        const videos = await Video.find().sort({
            createdAt: -1
        });

        return res.json(videos);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

export const getVideoById = async(req,res)=>{

    try{

        const video =
        await Video.findById(req.params.id);

        if(!video){

            return res.status(404).json({
                message:"Video not found"
            });

        }

        return res.json(video);

    }catch(error){

        return res.status(500).json({
            message:error.message
        });

    }

}