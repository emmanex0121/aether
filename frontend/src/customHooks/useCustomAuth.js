import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { axiosInstance } from "../api/axiosinstance.config";
import { endpoints } from "../api/endpoints";
import useNotification from "./useNotification";

const useAuth = () => {
  const [loading, setloading] = useState(false);
  const { onNotify } = useNotification();
  const navigate = useNavigate();

  //   function to call for sign up
  const onAuth = async (request) => {
    console.log("Form values", request);

    // setloading(true);

    // Define the endpoint based on request parameters
    let endpoint;
    if (request.firstName || request.lastName) {
      endpoint = endpoints.auth.signup;
    } else {
      endpoint = endpoints.auth.signin;
    }
    console.log(endpoint); // debugging line

    try {
      const response = await axiosInstance.post(endpoint, request);
      console.log(response.data);

      if (response.data?.responseCode === "00") {
        // console.log(response.data?.response);
        onNotify("success", "Successful", response?.data?.responseMessage);

        // collect the data and store them
        console.log(endpoint);
        localStorage.setItem("***", response.data?.data?.token);
        localStorage.setItem("firstName", response.data?.data?.firstName);
        localStorage.setItem("lastName", response.data?.data?.lastName);
        localStorage.setItem("email", response.data?.data?.email);
        localStorage.setItem("phone", response.data?.data?.phone);

        // upon completion
        setloading(false);

        setTimeout(() => {
          return navigate("/dashboard");
        }, 2000);
      } else {
        console.log(endpoint);
        onNotify("error", "Error occured", response?.data?.responseMessage);
        // upon failure
        setloading(false);
      }
    } catch (error) {
      console.error(error);
      setloading(false); // upon failure
      onNotify("error", "Error occured", error.response?.data?.responseMessage);
    }
  };

  return {
    onAuth,
    loading,
  };
};

export { useAuth };
