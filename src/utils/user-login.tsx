import axios from "axios";
import { authEndpoint } from "../constants";

const loginUser = async (username: string, password: string)=>{
  try {
    const response = await axios.post(authEndpoint, {
      username,
      password
    })
    if (!response.data || response.status !== 200){
      return ""
    } else return response.data.token;
  } catch(error){
    console.log(error);
    return "";
  }
} 

export default loginUser;