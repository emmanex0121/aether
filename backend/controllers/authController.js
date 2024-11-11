import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";

// Signup controller logic
const signUpController = async (req, res) => {
  const signUpSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    dob: Joi.date().iso().required(),
    phone: Joi.string().required(), // expects an ISO date format (YYYY-MM-DD)
    password: Joi.string().min(8).required(),
    street: Joi.string().required(),
    apt: Joi.string().allow(""),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().max(5).required(),
    country: Joi.string().required(),
  });

  try {
    // validate user request
    const { error } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    // destructured field/values from request body
    const {
      firstName,
      lastName,
      userName,
      email,
      dob,
      phone,
      password,
      street,
      apt,
      city,
      state,
      zip,
      country,
    } = req.body;

    // validating if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: `User ${email} already exist.`,
        data: null,
      });
    }

    // hashing password before saving
    const hashPassword = await bcrypt.hash(password, 5);

    // Create new user information
    user = new User({
      firstName,
      lastName,
      userName,
      email,
      phone,
      dob,
      password: hashPassword,
      address: {
        street,
        apt,
        city,
        state,
        zip,
        country,
      },
    });

    // save the new user to database
    await user.save();

    // if succefull generate a token for accessing protected routes.
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtsecret,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: `${email} registered succefully.`,
      data: {
        firstName,
        lastName,
        userName,
        email,
        phone,
        dob,
        token,
        address: {
          street,
          apt,
          city,
          state,
          zip,
          country,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error.",
      data: null,
    });
  }
};

// Signin Controller logic
const signInController = async (req, res) => {
  const adminSignInSchema = Joi.object({
    email: Joi.string().email().allow(null),
    userName: Joi.string().allow(null),
    password: Joi.string().min(8).required(),
  });

  try {
    const { error } = adminSignInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    const { userName, email, password } = req.body;

    // check if email or username is provided
    if (!email && !userName) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Username or Email is required.",
        data: null,
      });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ userName });
    }

    if (!user) {
      return res.status(401).json({
        responseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "Invalid Credentials.",
        data: null,
      });
    }

    // compare the password with the stored password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        responseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "Invalid Credentials.",
        data: null,
      });
    }

    // if succefull generate a token for accessing protected routes.
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtsecret,
      { expiresIn: "1h" }
    );

    // testing
    // console.log(token);
    // console.log(token.email);

    // if succesful, return success response
    // const formattedDob = user.dob.toISOString().split("T")[0]; // Formats to YYYY-MM-DD
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Signin Succesfully",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        // userName: user.userName,
        email: user.email,
        phone: user.phone,
        // dob: formattedDob,
        // address: user.address,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error.",
      data: null,
    });
  }
};

const adminSignInController = async (req, res) => {
  const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  try {
    const { error } = signInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    const { email, password } = req.body;
    let adminUser = await Admin.findOne({ email });
    if (!adminUser) {
      return res.status(401).json({
        responseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "Invalid Credentials.",
        data: null,
      });
    }

    // compare the password with the stored password
    const isPasswordMatch = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        responseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "Invalid Credentials.",
        data: null,
      });
    }

    // if succefull generate a token for accessing protected routes.
    const token = jwt.sign(
      { id: adminUser._id, email: adminUser.email },
      config.jwtsecret,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Signin Success.",
      data: {
        userName: adminUser.userName,
        email: adminUser.email,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error.",
      data: null,
    });
  }
};

// Admin signup controllrer
const adminSignUpController = async (req, res) => {
  const adminSignUpSchema = Joi.object({
    email: Joi.string().email().required(),
    userName: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });

  try {
    // validating the request
    const { error } = adminSignUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    const { email, userName, password } = req.body;
    let adminUser = await Admin.findOne({ email: email });
    if (adminUser) {
      return res.status(409).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: `User ${email} already exist`,
        data: null,
      });
    }

    adminUser = await Admin.findOne({ userName: userName });
    if (adminUser) {
      return res.status(409).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: `User ${userName} already exist`,
        data: null,
      });
    }

    const hashpassword = await bcrypt.hash(password, 5);
    if (!hashpassword) {
      console.error("Encryption error. Something Went wrong");
      return res.status(500).json({
        responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
        responseMessage: "Internal Server Error.",
        data: null,
      });
    }

    adminUser = new Admin({
      userName,
      email,
      password: hashpassword,
    });

    await adminUser.save();

    const token = jwt.sign(
      { id: adminUser._id, email: adminUser.email },
      config.jwtsecret,
      { expiresIn: "1hr" }
    );

    return res.status(201).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Admin created successfully.",
      data: {
        userName,
        email,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error.",
      data: null,
    });
  }
};

export {
  signInController,
  signUpController,
  adminSignInController,
  adminSignUpController,
};
