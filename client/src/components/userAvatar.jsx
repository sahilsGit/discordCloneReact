import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import { get } from "@/services/api-service";
import { handleError } from "@/lib/response-handler";
import { useState, useEffect, memo } from "react";
import { cn } from "@/lib/utils";

export const UserAvatar = memo(({ subject, className }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const access_token = useAuth("token");
  const authDispatch = useAuth("dispatch");

  const image = subject.image || null;

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await get(`/assets/getImage/${image}`, access_token);
        const imageData = await response.blob();

        if (response.ok) {
          const imageUrl = URL.createObjectURL(imageData);

          setImageSrc(imageUrl);
        }
      } catch (error) {
        handleError(error, authDispatch);
      }
    };

    if (subject.image) {
      getImage();
    }
  }, [subject.image]);

  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={imageSrc} alt="" />
      <AvatarFallback>
        {<img src="/fallback/userFinal.jpg"></img>}
      </AvatarFallback>
    </Avatar>
  );
});
