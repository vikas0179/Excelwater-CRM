import axios from "axios";
import { API_URL } from "./ApiEndPoint";
import { toast } from "react-toastify";

const Api = axios.create({
  baseURL: API_URL
});

Api.interceptors.request.use((req) => {
  const token = JSON.parse(localStorage.getItem("token"));
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});

Api.interceptors.response.use(
  async (response) => {
    if (response.data.status == "RC100") {
      toast.error(response.data.message);
      return response?.data;
    }
    if (response?.data?.status === "RC200") {
      response?.data?.message && toast.success(response?.data?.message);
      return response?.data;
    }

    if (response.data.status === "RC300") {
      localStorage.removeItem("token");
      window.location.href = "/";
      toast.error(response.data.message);
    } else {
      return response.data;
    }
  },
  (err) => {
    // if (err.message === "Network Error") {
    //   toast.error("You are not connected to Internet");
    // }
    // throw new Error(err);
  }
);

export default Api;

const fetcher = (url) => Api(url).then((res) => res);

export { fetcher };
