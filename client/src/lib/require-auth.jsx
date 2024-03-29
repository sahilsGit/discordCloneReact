import useAuth from "@/hooks/useAuth";
import { get } from "@/services/api-service";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleResponse } from "./response-handler";
import ErrorComponent from "./error-Component";
import { Loader2 } from "lucide-react";
import { forApiErrorInitial } from "./misc";

const RequireAuth = ({ children }) => {
  const user = useAuth("user");
  const access_token = useAuth("token");
  const navigate = useNavigate();
  const profileId = useAuth("id");
  const authDispatch = useAuth("dispatch");
  const name = useAuth("name");
  const image = useAuth("image");
  const email = useAuth("email");
  const about = useAuth("about");
  const [forApiError, setForApiError] = useState(forApiErrorInitial);

  // Error re-setter for standard error component
  const resetError = useCallback(() => {
    setForApiError(forApiErrorInitial);
  }, []);

  useEffect(() => {
    const refreshUserDetails = async () => {
      try {
        const response = await get("/auth/refresh", access_token);
        const data = await handleResponse(response, authDispatch);

        authDispatch({
          type: "SET_CUSTOM",
          payload: {
            about: data.about,
            email: data.email,
            image: data.image,
            name: data.name,
            profileId: data.profileId,
            user: data.user,
          },
        });
      } catch (error) {
        const { message } = handleError(error, authDispatch);
        setForApiError({
          ...forApiError,
          message: message,
        });
      }
    };

    if (user && access_token) {
      (!profileId || !name || !about === null || !image === null || !email) &&
        refreshUserDetails();
    } else {
      authDispatch({ type: "RESET_STATE" });
      navigate("/");
    }
  }, [user, access_token]);

  return !profileId ||
    !image === null ||
    !name ||
    !about === null ||
    !email ||
    !user ||
    !access_token ? (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader2
        strokeWidth={3}
        className="lg:w-6 lg:h-6 sm:w-4 sm:h-4 animate-spin"
      />
    </div>
  ) : forApiError.message ? (
    <ErrorComponent apiError={forApiError} resetError={resetError} />
  ) : (
    children
  );
};

export default RequireAuth;
