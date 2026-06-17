import { spawn } from "child_process";
import { Video } from "../models/video.models.js";

export const uploadVideo = async(req,res)=>{

    try{

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

        python.stdout.on("data",(data)=>{
            output += data.toString();
        });

        python.stderr.on("data",(data)=>{
            console.log(
                "PYTHON ERROR:",
                data.toString()
            );
        });

        python.on("close",async()=>{

            console.log("Python Output:",output);

            const result =
            JSON.parse(output);

            const savedVideo =
            await Video.create({
                fileName:req.file.filename,
                status:result.status,
                anomalyTime:result.time,
                confidence:result.confidence,
                framePath:result.frame
            });

            return res.json(result);

        });

    }catch(error){

        console.log(error);

        return res.status(500).json({
            message:error.message
        });

    }
};

export const getAllVideos =
async(req,res)=>{

    const videos =
    await Video.find();

    res.json(videos);
}