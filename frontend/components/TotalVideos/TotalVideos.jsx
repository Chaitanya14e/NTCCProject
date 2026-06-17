import { useEffect,useState } from "react";
import axios from "axios";

function TotalVideos(){

    const [videos,setVideos] =
    useState([]);

    useEffect(()=>{

        axios.get(
            "http://localhost:4000/video/all"
        )
        .then(res=>{
            setVideos(res.data);
        });

    },[]);

    return(

        <div>
            <button className="ml-4 border w-20 rounded-xl">Back</button>
            <h1 className="text-center text-3xl font-bold">
                Total Videos
            </h1>

            <div className="grid grid-cols-5 gap-4 ml-3">
            {videos.map((video) => {

                console.log(video);
                console.log(video.framePath);

                return (
                    // <div
                    //     key={video._id}
                    //     className="border rounded-lg p-4 shadow"
                    // >

                    //     <img
                    //         src="http://localhost:4000/frames/03.jpg"
                    //         alt="test"
                    //         className="w-full h-40 object-cover rounded border"
                    //     />

                    //     <h1>Video - {video.fileName}</h1>
                    //     <h1>Status - {video.status}</h1>
                    //     <h1>Anomaly Time - {video.anomalyTime}</h1>
                    //     <h1>Confidence - {video.confidence}</h1>

                    // </div>
                    <div
                        key={video._id}
                        className="border rounded-lg p-4 shadow"
                    >

                        {video.framePath && (
                            <img
                                src={`http://localhost:4000/${video.framePath}`}
                                alt="frame"
                                className="w-full h-40 object-cover rounded"
                            />
                        )}

                        <h1>
                            Video - {video.fileName}
                        </h1>

                        <h1>
                            Status -
                            <span
                                className={
                                    video.status === "anomaly"
                                    ? "text-red-500 font-bold"
                                    : "text-green-500 font-bold"
                                }
                            >
                                {" "}{video.status}
                            </span>
                        </h1>

                        {
                            video.status === "anomaly" && (
                                <>
                                    <h1>
                                        Anomaly Time -
                                        {video.anomalyTime}
                                    </h1>

                                    <h1>
                                        Confidence -
                                        {(video.confidence * 100).toFixed(2)}%
                                    </h1>
                                </>
                            )
                        }

                    </div>
                );

            })}
            </div>

        </div>
    );
}

export default TotalVideos;