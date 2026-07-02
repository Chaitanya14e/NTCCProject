// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDashboardStats } from "../../src/services/videoApi.js";
// import axios from "axios";

// function TotalVideos() {
//     const [stats,setStats] = useState({
//         total:0
//     })
//     const fetchStats = async()=>{
//         try {
//             const data = await getDashboardStats();
//             setStats(data);
//         } catch (error) {
//             console.log(error);
            
//         }
//     }
//     useEffect(()=>{
//         fetchStats()
//     })
//     const navigate = useNavigate();

//     const [videos, setVideos] = useState([]);

//     useEffect(() => {

//         axios
//             .get("http://localhost:4000/video/all")
//             .then((res) => {
//                 setVideos(res.data);
//             })
//             .catch((err) => {
//                 console.log(err);
//                 setVideos([]);
//             });

//     }, []);

//     return (

//         <div className="min-h-screen bg-gray-900/95">

//             {/* Header */}

//             <div className="p-6 border border-slate-700 bg-slate-800">
//                 <div className="flex">
//                     <button
//                         onClick={() => navigate("/")}
//                         className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold"
//                     >
//                         Back
//                     </button>
//                     <h1 className="text-4xl font-bold ml-10 text-white">
//                         Total Videos
//                     </h1>
//                 </div>
                
                
//                 <h1 className="ml-30 text-slate-400">
//                     {stats.total} Videos found
//                 </h1>
//             </div>

//             {/* <h1 className="text-xl ml-7 text-white">
//                 {stats.total} Videos found
//             </h1> */}
            
            

//             {/* Grid */}

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">

//                 {videos.length === 0 ? (

//                     <div className="text-xl">
//                         No Videos Found
//                     </div>

//                 ) : (

//                     videos.map((video) => (

//                         <div
//                             key={video._id}
//                             className={`rounded-2xl overflow-hidden
//                             shadow-lg hover:shadow-2xl hover:-translate-y-1
//                             transition-all duration-300 cursor-pointer
//                             ${
//                                 video.status === "anomaly"
//                                     ? " border-2 border-red-700/50 hover:border-red-600"
//                                     : "border-2 border-green-700/50 hover:border-green-600"
//                             }`}
//                         >

//                             {/* Image */}

//                             <div className="relative">

//                                 {video.framePath ? (

//                                     <img
//                                         src={`http://localhost:4000${video.framePath.startsWith("/") ? "" : "/"}${video.framePath}`}
//                                         alt="frame"
//                                         className="w-full h-64"
//                                         onError={(e)=>{
//                                             console.log("Failed:", e.target.src);
//                                         }}
//                                     />

//                                 ) : (

//                                     <div className="w-full h-64 flex items-center justify-center bg-white">
//                                         No Preview
//                                     </div>

//                                 )}

//                                 <div
//                                     className={`absolute top-3 right-3 px-4 py-1 rounded-full text-xs font-bold
//                                     ${
//                                         video.status === "anomaly"
//                                             ? "bg-red-600"
//                                             : "bg-green-600"
//                                     }`}
//                                 >
//                                     {video.status.toUpperCase()}
//                                 </div>

//                             </div>

//                             {/* Details */}

//                             <div className="p-5 space-y-4 bg-gray-700 text-white">

//                                 <h2 className="font-bold text-lg truncate">
//                                     {video.fileName}
//                                 </h2>

//                                 <div className="flex justify-between">

//                                     <span className="text-slate-400">
//                                         Status
//                                     </span>

//                                     <span
//                                         className={
//                                             video.status === "anomaly"
//                                                 ? "text-red-500 font-bold "
//                                                 : "text-green-400"
//                                         }
//                                     >
//                                         {video.status}
//                                     </span>

//                                 </div>

//                                 {video.status === "anomaly" && (

//                                     <>
//                                         <div className="flex justify-between text-white">

//                                             <span className="text-slate-400">
//                                                 Anomaly Time
//                                             </span>

//                                             <span>
//                                                 {video.anomalyTime}
//                                             </span>

//                                         </div>

//                                         <div className="flex justify-between">

//                                             <span className="text-slate-400">
//                                                 Confidence
//                                             </span>

//                                             <span className="text-red-500 font-bold">
//                                                 {(video.confidence).toFixed(2)}%
//                                             </span>

//                                         </div>

//                                     </>

//                                 )}

//                                 {video.status === "clean" && (
                                    
//                                     <div className="flex justify-between">
//                                         <span className="text-slate-400">
//                                             Confidence
//                                         </span>

//                                         <span className="text-green-400 font-bold">
//                                             {(video.confidence).toFixed(2)}%
//                                         </span>

//                                     </div>

//                                 )}

//                                 {/* Progress Bar */}

//                                 <div className="w-full bg-black h-2 rounded-full">

//                                     <div
//                                         className={`h-full rounded-full
//                                         ${
//                                             video.status === "anomaly"
//                                                 ? "bg-red-500"
//                                                 : "bg-green-500"
//                                         }`}
//                                         style={{
//                                             width: `${video.confidence}%`
//                                         }}
//                                     />

//                                 </div>

//                             </div>

//                         </div>

//                     ))

//                 )}

//             </div>

//         </div>

//     );
// }

// export default TotalVideos;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../src/services/videoApi.js";
import axios from "axios";

function TotalVideos() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0 });
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.log);
    axios
      .get("http://localhost:4000/video/all")
      .then((res) => setVideos(res.data))
      .catch(() => setVideos([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 h-14 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <span className="text-sm font-medium text-slate-900">Total videos</span>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
          {stats.total} videos
        </span>
      </div>

      <div className="p-6">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
          All analyzed videos
        </p>

        {videos.length === 0 ? (
          <div className="border border-slate-200 rounded-xl p-12 text-center bg-white">
            <div className="text-3xl mb-3">🎥</div>
            <p className="text-slate-500 text-sm">No videos analyzed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {videos.map((video) => {
              const isAnomaly = video.status === "anomaly";
              return (
                <div
                  key={video._id}
                  className={`bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer ${
                    isAnomaly ? "border-t-2 border-t-red-500" : "border-t-2 border-t-green-500"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative bg-slate-100 h-48">
                    {video.framePath ? (
                      <img
                        src={`http://localhost:4000${video.framePath.startsWith("/") ? "" : "/"}${video.framePath}`}
                        alt="frame"
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No preview
                      </div>
                    )}
                    <span
                      className={`absolute top-2.5 right-2.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        isAnomaly
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {isAnomaly ? "Anomaly" : "Clean"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <p className="text-sm font-medium text-slate-900 truncate mb-3">
                      {video.fileName}
                    </p>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">Status</span>
                        <span className={`text-xs font-medium ${isAnomaly ? "text-red-500" : "text-green-500"}`}>
                          {video.status}
                        </span>
                      </div>
                      {isAnomaly && (
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-400">Anomaly time</span>
                          <span className="text-xs text-slate-700">{video.anomalyTime}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">Confidence</span>
                        <span className={`text-xs font-medium ${isAnomaly ? "text-red-500" : "text-green-500"}`}>
                          {video.confidence.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAnomaly ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${video.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TotalVideos;