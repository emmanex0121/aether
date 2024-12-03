import express from "express";
import { getCountry } from "../controllers/countryController.js";

const countryRouter = express.Router();

countryRouter.get("/", getCountry);

export { countryRouter };
