import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://way-go-backend.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;