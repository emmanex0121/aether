import axios from "axios";
import { apiResponseCode } from "../helper.js";

const getCountry = async (req, res) => {
  try {
    const response = await axios.get(
      "https://ipinfo.io/json?token=ff55629580ecf2"
    );
    console.log("Line 7 countryController", response.data);
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "user Plans fetched succesfully",
      data: response.data,
    });
  } catch (error) {
    res.status(500).send("Error fetching IP information");
    return res.status(500).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Error fetching IP information",
      data: null,
    });
  }
};

export { getCountry };
