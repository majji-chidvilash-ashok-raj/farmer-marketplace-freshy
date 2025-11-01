import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverURL } from '../App'
import { rules } from 'eslint-plugin-react-refresh'

const useGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/user/current`, { withCredentials: true });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser
