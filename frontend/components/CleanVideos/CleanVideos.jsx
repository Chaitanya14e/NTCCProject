// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDashboardStats } from "../../src/services/videoApi.js";
// import axios from "axios";

// function CleanVideos() {
//     const [stats,setStats] = useState({
//         clean:0
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
//         fetchStats();
//     })

//     const navigate = useNavigate();

//     const [videos, setVideos] = useState([]);

//     useEffect(() => {

//         axios.get("http://localhost:4000/video/clean")
//         .then((res) => {

//             console.log(res.data);

//             setVideos(res.data.clean);

//         })
//         .catch((err) => {

//             console.log(err);

//             setVideos([]);

//         });

//     }, []);

//     return (

//         <div className="min-h-screen bg-gray-900/95">
//             <div className="p-6 border border-slate-700 bg-slate-800">
//                 <div className="flex">
//                      <button
//                         onClick={() => navigate("/")}
//                         className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold"
//                     >
//                         Back
//                     </button>

//                     <h1 className="text-4xl font-bold text-green-600 ml-10">
//                         Clean Videos
//                     </h1>
//                 </div>
//                 <h1 className="text-slate-400 ml-30">
//                     {stats.clean} Videos found
//                 </h1>
//             </div>
           

//             <div className="grid grid-cols-4 gap-6 px-4">

//                 {videos.length === 0 ? (

//                     <h1 className="text-xl text-white">
//                         No clean videos found
//                     </h1>

//                 ) : (

//                     videos.map((video) => (

//                         <div
//                             key={video._id}
//                             className="h-100 w-full border-2 border-green-300 rounded-lg p-4 shadow mt-5"
//                         >

//                             {video.framePath ? (

//                                 <img
//                                     src={`http://localhost:4000${video.framePath.startsWith("/") ? "" : "/"}${video.framePath}`}
//                                     alt="frame"
//                                     className="w-full h-60 rounded"
//                                 />

//                             ) : (

//                                 <div className="w-full h-60 bg-gray-100 rounded flex items-center justify-center">

//                                     <div className="text-center">

//                                         <div className="text-5xl mb-2">
//                                             🎥
//                                         </div>

//                                         <p className="text-gray-500 font-medium">
//                                             No Video Preview
//                                         </p>

//                                     </div>

//                                 </div>

//                             )}

//                             <h1 className="text-center font-bold text-2xl mt-3 text-gray-200">
//                                 Video Details
//                             </h1>

//                             <div className="mt-4 space-y-2 text-white">

//                                 <p>
//                                     <strong>Video:</strong>{" "}
//                                     {video.fileName}
//                                 </p>

//                                 <p>
//                                     <strong>Status:</strong>
//                                     <span className="text-green-500 font-bold ml-2">
//                                         {video.status}
//                                     </span>
//                                 </p>

//                                 {video.status === "anomaly" && (
//                                     <>
//                                         <p>
//                                             <strong>Anomaly Time:</strong>{" "}
//                                             {video.anomalyTime}
//                                         </p>

//                                         <p>
//                                             <strong>Anomaly Time:</strong>{" "}
//                                             {video.anomalyTime}
//                                         </p>
//                                         <p>
//                                             <strong>Confidence:</strong>{" "}
//                                             {(video.confidence).toFixed(2)}%
//                                         </p>
//                                     </>
//                                 )}

//                                 <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">

//                                     <div
//                                         className="h-full bg-green-500 rounded-full"
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

// export default CleanVideos;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../src/services/videoApi.js";
import axios from "axios";

function CleanVideos() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clean: 0 });
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.log);
    axios
      .get("http://localhost:4000/video/clean")
      .then((res) => setVideos(res.data.clean))
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
        <span className="text-sm font-medium text-slate-900">Clean videos</span>
        <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
          {stats.clean} clean
        </span>
      </div>

      <div className="p-6">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
          No anomalies detected
        </p>

        {videos.length === 0 ? (
          <div className="border border-slate-200 rounded-xl p-12 text-center bg-white">
            <div className="text-3xl mb-3">🎥</div>
            <p className="text-slate-500 text-sm">No clean videos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 border-t-2 border-t-green-500 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <div className="relative bg-slate-100 h-48">
                  {video.framePath ? (
                    <img
                      src={`http://localhost:4000${video.framePath.startsWith("/") ? "" : "/"}${video.framePath}`}
                      alt="frame"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                      No preview
                    </div>
                  )}
                  <span className="absolute top-2.5 right-2.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                    Clean
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium text-slate-900 truncate mb-3">
                    {video.fileName}
                  </p>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Confidence</span>
                      <span className="text-xs font-medium text-green-500">
                        {video.confidence.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${video.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CleanVideos;