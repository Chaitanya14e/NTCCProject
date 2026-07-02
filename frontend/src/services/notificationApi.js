import axios from "axios";

export const getNotifications = async () => {
    const response = await axios.get(
        "http://localhost:4000/notification"
    );
    return response.data;
};

export const markAllNotificationsRead = async () => {
  const res = await axios.patch("http://localhost:4000/notification/mark-read");
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await axios.delete(`http://localhost:4000/notification/${id}`);
  return res.data;
};