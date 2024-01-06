import { useEffect, useState } from "react";
import { ActionTooltip } from "../actionTooltip";
import { get } from "@/services/api-service";
import { handleError, handleResponse } from "@/lib/response-handler";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useServer from "@/hooks/useServer";

export const NavItem = ({ name, id, image }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const navigate = useNavigate();
  const access_token = useAuth("token");
  const authDispatch = useAuth("dispatch");
  const serverDetails = useServer("serverDetails");
  const [clicked, setClicked] = useState(false);
  const servers = useServer("servers");
  const serverDispatch = useServer("dispatch");
  const channelDetails = useServer("channelDetails");

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await get(`/images/get/${image}`, access_token);
        const imageData = await response.blob();
        const imageUrl = URL.createObjectURL(imageData);

        setImageSrc(imageUrl);
      } catch (err) {
        handleError(err, authDispatch);
      }
    };

    getImage();
  }, [image]);

  const fetchChannelData = async () => {
    try {
      const response = await get(
        `/channels/${id}/${servers[id].channels[0]}`,
        access_token
      );

      const data = await handleResponse(response, authDispatch);

      serverDispatch({
        type: "SET_CUSTOM",
        payload: {
          serverDetails: data.server,
          channelDetails: data.channel[1],
        },
      });

      console.log(data.server);
    } catch (err) {
      const errCode = handleError(err, authDispatch);
      if (errCode === 404) {
        navigate("/@me/conversations");
      }
    }
  };

  useEffect(() => {
    if (!serverDetails) {
      setClicked(false);
    } else {
      if (serverDetails.id !== id) {
        setClicked(false);
      } else setClicked(true);
    }
  }, [serverDetails, channelDetails]);

  return (
    <button
      onClick={() => {
        setClicked(true);
        fetchChannelData();
      }}
      className={cn("w-full flex items-center justify-center group relative")}
    >
      <div
        className={cn(
          "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
          serverDetails?.id !== id && "group-hover:h-[20px]",
          clicked && serverDetails?.id === id ? "h-[36px]" : "h-[8px]",
          clicked && serverDetails?.id !== id && "h-[20px]"
        )}
      ></div>
      <ActionTooltip side="right" align="center" label={name}>
        <div
          className={cn(
            "flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            ((clicked && serverDetails?.id === id) || clicked) &&
              "rounded-[16px]",
            id !== serverDetails?.id && clicked && "translate-y-[1px]"
          )}
        >
          <img className="" src={imageSrc} />
        </div>
      </ActionTooltip>
    </button>
  );
};