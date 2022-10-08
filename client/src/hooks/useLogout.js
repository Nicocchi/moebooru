import axios from "../utils/axios.config";
import useAuth from "./useAuth";

export const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const res = await axios.get("/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};
