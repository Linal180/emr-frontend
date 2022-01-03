import axios from "axios";
import dotenv from 'dotenv';

import Alert from "../components/common/Alert";
import { TOKEN } from "../constants";
import { handleLogout } from "../utils";

const AUTH_MESSAGE = "authentication credentials were not provided"
export const baseUrl = process.env.REACT_APP_API_BASE_URL;
dotenv.config()

const server = axios.create({
  baseURL: baseUrl,
});
const { interceptors: { request } } = server

request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN);

    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  },

  (error) => {
    const { response: { data, message } } = error
    if (data) {
      if (message !== AUTH_MESSAGE) {
        Alert.error(data.message)
      }

      if (message === AUTH_MESSAGE) {
        handleLogout();
        Alert.error(data.message);
      }
    }
  }
);

export default server;