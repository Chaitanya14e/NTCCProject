import cors from "cors";
import express from "express"
const app = express();
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
);
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}));
app.use(
    "/uploads",
    express.static("uploads")
);
app.use(
    "/frames",
    express.static("uploads/frames")
);
import videoRouter from "./routes/video.routes.js"
app.use("/video",videoRouter)

export {app}