import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/video"
});

export const uploadVideo = async(file)=>{

    const formData = new FormData();

    formData.append(
        "video",
        file
    );

    const res = await API.post(
        "/upload",
        formData,
        {
            headers:{
                "Content-Type":
                "multipart/form-data"
            }
        }
    );

    return res.data;
};

export const getDashboardStats = async()=>{

    const res = await API.get(
        "/dashboard"
    );

    return res.data;
};

export const getAllVideos = async () => {
    const res = await API.get(
        "/all"
    )
    return res.data;
}
