import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/UserSlice";
import { serverURL } from "../App";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/user/current`, {
          withCredentials: true,
        });

        if (response.data?.user) {
          dispatch(setUserData(response.data.user));
        } else {
          console.warn("No user data found in response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching current user:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
