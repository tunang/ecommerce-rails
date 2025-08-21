import cable from "actioncable";

const token = localStorage.getItem("access_token");

const consumer = cable.createConsumer(
  `${import.meta.env.VITE_API_BASE_URL.replace(/^http/, "ws")}/cable?token=${token}`
);

export default consumer;