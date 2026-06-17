import "./App.css"
import { useEffect } from "react";
import {
    uploadVideo,
    getDashboardStats
} from "./services/videoApi.js";
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
    const [isDragActive, setIsDragActive] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [videos,setVideos] = useState([]);
    const [loading,setLoading] = useState(false);

    const [stats,setStats] = useState({
      total:0,
      anomalies:0,
      clean:0
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
            setFileName(file.name);
            handleVideoUpload(file);
        }
        }
    };

    const handleFileInput = (e) => {

        const files = e.target.files;

        if(files && files.length > 0){

            const file = files[0];

            if(file.type.startsWith("video/")){

                setFileName(file.name);

                handleVideoUpload(file); // call backend
            }
        }
    };
    const fetchStats = async()=>{

      try{

          const data =
          await getDashboardStats();
          setStats(data);

      }catch(error){

        console.log(error);

      }
    };

    useEffect(()=>{

      fetchStats();

    },[]);


    const handleVideoUpload = async(file)=>{

      try{

          setLoading(true);

          const prediction =
          await uploadVideo(file);

          const newVideo = {

              id:Date.now(),

              name:file.name,

              isAnomaly:
                  prediction.status ===
                  "anomaly",

              confidence:
                  prediction.confidence,

              anomalyTime:
                  prediction.time
          };

          setVideos(prev=>[
              newVideo,
              ...prev
          ]);

          fetchStats();

      }catch(error){

          console.log(error);

      }finally{

          setLoading(false);

      }
  };

  const dashboardCards = [

  {
      label:'Total Videos',
      value:stats.total,
      icon:TrendingUp,
      color:'from-blue-500 to-blue-300',
      route:'/videos'
  },

  {
      label:'Anomalies Detected',
      value:stats.anomalies,
      icon:AlertTriangle,
      color:'from-red-500 to-red-300',
      route:'/anomalies'
  },

  {
      label:'Clean Videos',
      value:stats.clean,
      icon:CheckCircle,
      color:'from-green-500 to-green-500/60',
      route:'/clean'
  }

  ];
  return (
    
    <div>
      <div className="border-2 h-20 flex items-center">
        <h1 className="ml-10 text-3xl font-bold">
          AI Surveillance System
        </h1>
      </div>

      <div>
        <div className="flex h-40 items-center justify-center text-2xl">
          <h1>
            Upload and analyze videos for anomalies using advanced AI technology
          </h1>
        </div>

        <div className="w-300 ml-40">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDragLeave}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`bg-gray-300 relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-500 p-12 transition-all ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30"
            }`}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="absolute inset-0 cursor-pointer opacity-0"
            />

            <div className="border rounded-4xl bg-blue-100 p-4">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Upload Video
              </h3>

              <p className="mt-2 text-sm">
                {fileName ? (
                  <span className="font-medium">
                    {fileName}
                  </span>
                ) : (
                  <>
                    Drag and drop your video here or click to browse
                    <br />
                    <span className="text-xs">
                      Supported formats:
                      MP4, WebM, MKV, AVI
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-blue-500">
              Analyzing Video...
            </h2>
          </div>
        )}

        <div className="mb-12 grid gap-4 sm:grid-cols-3 mt-10">
          {dashboardCards.map((stat,index)=>{

            const Icon = stat.icon;

            return (

              <div
                key={index}
                onClick={() => navigate(stat.route)}
                className="rounded-2xl border p-6 hover:shadow-lg ml-2"
              >
                <div className="flex items-center justify-between ">

                  <div>
                    <p className="text-sm uppercase">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`rounded-full bg-linear-to-br ${stat.color} p-3 -mt-10`}
                  >
                    <Icon size={25}/>
                  </div>

                </div>
              </div>

            );

          })}
        </div>

        {/* Recent Analysis */}

        <div className="px-10 mb-10">

          <h2 className="text-2xl font-bold mb-4">
            Recent Analysis
          </h2>

          {
            videos.length === 0 ? (

              <div className="border rounded-lg p-6 text-center">

                No videos analyzed yet

              </div>

            ) : (

              videos.map((video)=>(

                <div
                  key={video.id}
                  className="border rounded-lg p-4 mb-3"
                >

                  <h3 className="font-semibold text-lg">
                    {video.name}
                  </h3>

                  <p>
                    Status :
                    {
                      video.isAnomaly
                      ?
                      <span className="text-red-500 font-bold ml-2">
                        Anomaly
                      </span>
                      :
                      <span className="text-green-500 font-bold ml-2">
                        Clean
                      </span>
                    }
                  </p>

                  <p>
                    Confidence :
                    {video.confidence}
                  </p>

                  <p>
                    Anomaly Time :
                    {
                      video.anomalyTime
                      ?
                      video.anomalyTime
                      :
                      "N/A"
                    }
                  </p>

                </div>

              ))

            )
          }

        </div>

      </div>
    </div>
    );
  
}

export default App
