// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDashboardStats } from "../../src/services/videoApi";
// import axios from "axios";

// function AnomalyVideos() {
//     const [stats,setStats] = useState({
//         anomalies:0
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
//     },[])

//     const navigate = useNavigate();

//     const [videos, setVideos] = useState([]);

//     useEffect(() => {

//         axios.get("http://localhost:4000/video/anomalies")
//         .then((res) => {
//             console.log(res.data);
//             setVideos(res.data.anomaly);
//         })
//         .catch((err) => {

//           console.log(err);

//           setVideos([]);
//         });

//     }, []);


//     return (
//         <div className="min-h-screen bg-gray-900/95">
//             <div className="p-6 border border-slate-700 bg-slate-800">
//                 <div className="flex">
//                     <button
//                         onClick={() => navigate("/")}
//                         className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold"
//                     >
//                         Back
//                     </button>
//                     <h1 className="text-4xl font-bold text-red-600 ml-10">
//                         Anomaly Videos 
//                     </h1>
//                 </div>
//                 <h1 className="ml-30 text-xl text-slate-400">
//                     {stats.anomalies} Videos found
//                 </h1>
                
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">

//                 {videos.length === 0 ? (

//                     <h1 className="text-xl">
//                         No anomaly videos found
//                     </h1>

//                 ) : (

//                     videos.map((video) => (

//                         <div
//                             key={video._id}
//                             className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-red-700/50 hover:shadow-2xl transition duration-300 hover:border-red-600 cursor-pointer"
//                         >

//                             <div className="relative">

//                                 <img
//                                     src={`http://localhost:4000${video.framePath.startsWith("/") ? "" : "/"}${video.framePath}`}
//                                     alt="frame"
//                                     className="w-full h-64 "
//                                 />

//                                 <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full">
//                                     ANOMALY
//                                 </div>

//                                 <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-3">
//                                     <h2 className="text-white font-bold text-lg truncate">
//                                         {video.fileName}
//                                     </h2>
//                                 </div>

//                             </div>

//                             <div className="p-5 text-white bg-gray-700">

//                                 <div className="flex justify-between mb-3">
//                                     <span className="font-semibold">
//                                         Status
//                                     </span>

//                                     <span className="text-red-500 font-bold">
//                                         Anomaly Detected
//                                     </span>
//                                 </div>

//                                 <div className="flex justify-between mb-3">
//                                     <span className="font-semibold">
//                                         Time
//                                     </span>

//                                     <span>
//                                         {video.anomalyTime}
//                                     </span>
//                                 </div>

//                                 <div className="flex justify-between mb-4">
//                                     <span className="font-semibold">
//                                         Confidence
//                                     </span>

//                                     <span className="font-bold text-red-600">
//                                         {(video.confidence).toFixed(2)}%
//                                     </span>
//                                 </div>

//                                 <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">

//                                     <div
//                                         className="bg-red-500 h-full rounded-full"
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

// export default AnomalyVideos;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../src/services/videoApi";
import axios from "axios";

function AnomalyVideos() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ anomalies: 0 });
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.log);
    axios
      .get("http://localhost:4000/video/anomalies")
      .then((res) => setVideos(res.data.anomaly))
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
        <span className="text-sm font-medium text-slate-900">Anomaly videos</span>
        <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
          {stats.anomalies} anomalies
        </span>
      </div>

      <div className="p-6">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
          Flagged for review
        </p>

        {videos.length === 0 ? (
          <div className="border border-slate-200 rounded-xl p-12 text-center bg-white">
            <div className="text-3xl mb-3">✅</div>
            <p className="text-slate-500 text-sm">No anomalies detected</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 border-t-2 border-t-red-500 hover:border-slate-300 transition-colors cursor-pointer"
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
                  <span className="absolute top-2.5 right-2.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                    Anomaly
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium text-slate-900 truncate mb-3">
                    {video.fileName}
                  </p>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Anomaly time</span>
                      <span className="text-xs text-slate-700">{video.anomalyTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Confidence</span>
                      <span className="text-xs font-medium text-red-500">
                        {video.confidence.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500"
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

export default AnomalyVideos;