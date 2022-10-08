import axios from "../utils/axios.config";
import useAuth from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const res = await axios.get("/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => {
        return {
          ...prev,
          roles: res.data.roles,
          accessToken: res.data.accessToken,
        };
      });

      return res.data.accessToken;
    } catch (error) {
      console.error(error);
    }
  };
  return refresh;
};
