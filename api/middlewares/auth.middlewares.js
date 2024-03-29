import jwt from "jsonwebtoken";
import Session from "../modals/session.modals.js";
import Profile from "../modals/profile.modals.js";

const verifyToken = async (req, res, next) => {
  // Extract tokens from cookies and headers
  const accessToken = req.headers["authorization"];
  const refreshToken = req.cookies.refresh_token;

  // Don't issue new token if access token is absent even if refresh token is present
  if (!accessToken) {
    return res.status(401).send({ message: "Invalid Token" });
  }

  try {
    // Extract the access_token out of the auth header
    const token = accessToken.split(" ")[1];

    // Verify access_token
    const decoded = jwt.verify(token, process.env.JWT);

    // Successful verification, attach decoded JWT payload to the request
    req.user = decoded;

    next(); // Let the user continue
  } catch (error) {
    // If access_token's expired handle new token generation
    if (error.name === "TokenExpiredError") {
      try {
        // Verify refreshToken
        const decoded = jwt.verify(refreshToken, process.env.REFRESH);

        const session = await Session.find({ token: refreshToken });

        if (session.length < 0 || Date.now() > session[0].expireAt) {
          return res.status(401).send({ message: "Invalid Token" });
        }

        // Refresh token is valid, generate a new access token and send it in the response

        const profile = await Profile.findById(decoded.profileId);

        const newAccessToken = jwt.sign(
          {
            username: profile.username,
            profileId: profile._id,
            name: profile.name,
            image: profile.image,
          },
          process.env.JWT,
          {
            expiresIn: "5m", // Token expiration time
          }
        );

        // Extract the old expired token out of the headers
        const { Authorization, ...headers } = req.headers;

        // Add new access_token to the headers to let the request continue
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        // Replace old headers with new ones
        req.headers = newHeaders;

        // Attach decoded JWT payload to the request
        req.user = decoded;

        /*
         * Add newAccessToken to the response so that client can update the token.
         * From now on every authenticated request will check if body is present,
         * A "if(res.body)" evaluating to true will indicate that a newAccessToken
         * has been attached. So the body will be spread to attach endpoint
         * specific data and new body will be sent.
         *
         * res.body = { ...res.body, data: endPointSpecificData }
         * res.status(200).send(res.body)
         *
         */

        res.body = {
          newAccessToken: newAccessToken,
          username: decoded.username,
          profileId: decoded.profileId,
          name: decoded.name,
          image: decoded.image,
        };

        // Call the next middleware
        next();
      } catch (error) {
        // Don't issue new token if refresh_token is expired or invalid
        return res.status(401).send({ message: "Invalid Token" });
      }
    } else {
      // Other errors reflect tempering or other suspicious reasons, DON'T ISSUE TOKEN!!
      return res.status(401).send({ message: "Invalid Token" });
    }
  }
};

export { verifyToken };
