import Profile from "../modals/profile.modals.js";
import Session from "../modals/session.modals.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  /*
  Handles user Registration
  */
  try {
    const { username, name, email, password } = req.body;

    // Validations
    if (!username) {
      return res.send({ message: "A unique username is required" });
    }
    if (!name) {
      return res.send({ message: "Full name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }

    const existingProfile = await Profile.findOne({ email });

    // Checking if user already exists
    if (existingProfile) {
      return res.status(200).send({
        success: false,
        message: "Already Registered, you can login",
      });
    }

    // If not, then carry on with the registration process
    if (!password) {
      return res.send({ error: "Password is Required" });
    }

    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(password, salt);

    const newProfile = new Profile({
      username,
      name,
      email,
      password: password,
    });

    // Checking if optional data given
    if (req.body.image) {
      newProfile.image = req.body.image;
    }

    await newProfile.save();
    res.status(200).send("Profile has been created");
  } catch (err) {
    err.status = 500;
    err.message = "Internal server error!";

    next(err);
  }
};

const login = async (req, res, next) => {
  /*
  Handles user login
  */
  try {
    // Validation

    console.log("inside login controller");

    const email = req.body.email;
    const receivedPassword = req.body.password;

    if (!email || !receivedPassword) {
      return res.status(404).send({
        success: false,
        message: "email or password can't be empty",
      });
    }

    const userProfile = await Profile.findOne({ email });

    // Check if the user exists
    if (!userProfile) {
      return res.status(404).send({
        success: false,
        message: "Profile not found, register before logging in",
      });
    }

    console.log(receivedPassword, userProfile.password);

    const isPasswordCorrect = await bcrypt.compare(
      receivedPassword,
      userProfile.password
    ); // Compare the password with its hashed version

    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).send({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Create a session equivalent JWT token
    const access_token = jwt.sign(
      {
        username: userProfile.username,
        profileId: userProfile._id,
        name: userProfile.name,
        image: userProfile.image,
      },
      process.env.JWT,
      {
        expiresIn: "5m", // Token expiration time
      }
    ); // Authorize user using the secret key

    const refresh = jwt.sign(
      {
        username: userProfile.username,
        profileId: userProfile._id,
        name: userProfile.name,
        image: userProfile.image,
      },
      process.env.REFRESH,
      {
        expiresIn: "30m", // Token expiration time
      }
    ); // Authorize user using the secret key

    const newSession = new Session({
      token: refresh,
      profileId: userProfile._id,
      expireAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    await newSession.save();

    res.cookie("refresh_token", refresh, {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
      maxAge: 30 * 60 * 1000,
    });

    res.status(200).send({
      username: userProfile.username,
      newAccessToken: access_token,
      profileId: userProfile._id,
      name: userProfile.name,
      image: userProfile.image || null,
    });
  } catch (err) {
    err.status = 500;
    err.message = "Internal server error!";

    next(err);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (cookies.refresh_token) {
      res.clearCookie("refresh_token");
    }

    await Session.findOneAndRemove({ token: cookies.refresh_token });

    // Send a response to the client
    res.send("Success! Cookies' gone");
  } catch (err) {
    err.status = 500;
    err.message = "Internal server error!";

    next(err);
  }
};

const refreshUserDetails = async (req, res) => {
  // Extract tokens from cookies and headers
  try {
    const profile = await Profile.findById(req.user.profileId);

    res.status(200).send({
      user: profile.username,
      profileId: profile._id,
      name: profile.name,
      image: profile.image,
      email: profile.email,
      about: profile.about,
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

export { handleLogout, refreshUserDetails, register, login };
