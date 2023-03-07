
import axios from "axios"

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Access-Control-Allow-Origin": `http://localhost:8080`,
    'Access-Control-Allow-Credentials': "true",
  }
})

export default instance;