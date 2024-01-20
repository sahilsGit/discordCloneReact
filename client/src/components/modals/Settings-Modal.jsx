import { useModal } from "@/hooks/useModals";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { UserAvatar } from "../userAvatar";
import useAuth from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scrollArea";
import { Pencil } from "lucide-react";
import { Form, FormField } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleError, handleResponse } from "@/lib/response-handler";
import { Avatar, AvatarImage } from "../ui/avatar";
import { get, post, update } from "@/services/api-service";
import { cn } from "@/lib/utils";
import "../../App.css";

const SettingsModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  console.log(isOpen, type);
  const isModalOpen = isOpen && type === "settings";
  const username = useAuth("user");
  const [avatarImage, setAvatarImage] = useState(null);
  const authDispatch = useAuth("dispatch");
  const [imagePreview, setImagePreview] = useState(null);
  const access_token = useAuth("token");
  const [hasChanged, setHasChanged] = useState(true);

  // console.log(hasChanged);

  useEffect(() => {
    if (isModalOpen) {
      form.setValue("name", data.name);
      form.setValue("about", data.about);
      form.setValue("email", data.email);
      form.setValue("username", data.username);
    }
  }, [isModalOpen]);

  const formSchema = z.object({
    name: z.string().min(1, {
      message: "At least you had a name before!",
    }),
    username: z.string().min(1, {
      message: "We can't call you 'nothing' or can we?",
    }),
    about: z.string().max(60, {
      message: "Can't exceed 60 characters.",
    }),
    // email: z.string().email(),
  });

  // react-hook-from setup with zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      username: username,
      about: "",
      // email: "",
    },
  });

  const handleClose = () => {
    setHasChanged(false);
    onClose();
  };

  const handlePencilClick = () => {
    const fileInput = document.querySelector(".imageField");
    fileInput.click(); // From here onChange takes charge
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    // console.log("file", file);
    if (file) {
      setAvatarImage(file); // Set the AvatarImage state with the choose image
    }
  };

  // Use effect to display selected-image preview
  useEffect(() => {
    if (avatarImage) {
      // console.log("Kicking this as avatarImage is triggered", avatarImage);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result); // Set avatar preview
      };
      reader.readAsDataURL(avatarImage);
    } else {
      setImagePreview(null);
    }

    isModalOpen ? setHasChanged(true) : setHasChanged(!hasChanged);
  }, [avatarImage]);

  const uploadImage = async () => {
    if (avatarImage) {
      const formData = new FormData();
      formData.append("image", avatarImage);

      try {
        const response = await post(
          "/assets/uploadFile",
          formData,
          access_token,
          {}
        );

        const data = await handleResponse(response, authDispatch); // Parse the res
        const { newFilename } = data; // Access the newFilename property

        return newFilename; // For DB storage
      } catch (err) {
        handleError(err, authDispatch);
      }
    } else {
      return null;
    }
  };

  const onSubmit = async (values) => {
    const image = await uploadImage(); // Wait for image you get upon resolution

    console.log(image);

    const updatedValues = {};

    if (image) {
      updatedValues["image"] = image;
    }
    if (data.name !== values.name) {
      updatedValues["name"] = values.name;
    }
    if (data.username !== values.username) {
      updatedValues["name"] = values.username;
    }
    if (data.about !== values.about) {
      updatedValues["about"] = values.about;
    }

    if (Object.keys(updatedValues).length === 0) {
      console.log("You did not change anything");
      return;
    }

    try {
      const response = await update(
        `/profiles/updateProfile`,
        updatedValues,
        access_token
      );

      await handleResponse(response, authDispatch);
    } catch (err) {
      handleError(err, authDispatch);
    }

    setTimeout(() => {
      onClose();
      form.reset();
    }, 1000);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-main07 text-black p-0 w-screen h-screen">
        <ScrollArea>
          <div className="flex">
            <div className="flex-1 grow"></div>
            <div className="flex w-[850px] flex-col py-16 gap-y-4 shrink-0">
              <p className="text-xl font-semibold text-white">My Account</p>
              <div className="relative h-[100px] w-full bg-indigo-500 flex flex-col rounded-lg">
                <input
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  className="hidden imageField"
                  onChange={handleAvatarChange}
                />
                <div className="absolute top-10 left-4">
                  {avatarImage ? (
                    <Avatar className="border-8 border-main07 h-[90px] w-[90px] md:h-[90px] md:w-[90px] absolute top-4 left-4">
                      <AvatarImage src={imagePreview} />
                    </Avatar>
                  ) : (
                    <UserAvatar
                      subject={{ name: data.name, image: data.image }}
                      className="border-8 border-main07 h-[90px] w-[90px] md:h-[90px] md:w-[90px] absolute top-4 left-4"
                    />
                  )}

                  <button
                    className="flex items-center justify-center absolute top-[68px] left-[78px] rounded-full h-[40px] text-white border-8 border-main07 bg-main06 hover:bg-main05 w-[40px] transition"
                    onClick={handlePencilClick}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col mt-8 rounded-b-lg w-full p-4 pb-1"
                >
                  <div className="flex gap-x-4">
                    <div className="flex-1 flex flex-col p-2">
                      <div className="flex flex-col gap-y-3">
                        <div className="flex flex-col gap-y-2">
                          <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                            Display Name
                          </p>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <Input
                                type="text"
                                className="py-3 rounded-sm px-2 bg-main10 text-white text-sm"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setHasChanged(true);
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-y-2">
                          <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                            Username
                          </p>
                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <Input
                                type="text"
                                className="py-3 rounded-sm px-2 bg-main10 text-white text-sm"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setHasChanged(true);
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <Separator className="my-7 bg-main06 w-full h-[1px]" />
                      <div className="flex flex-col gap-y-2">
                        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                          Email
                        </p>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <Input
                              type="email"
                              className="py-3 rounded-sm px-2 bg-main10 text-white text-sm"
                              {...field}
                              disabled={true}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col px-3 py-2 flex-1 gap-y-2">
                      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                        About Me
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        You can use markdowns and links if you'd like.
                      </p>
                      <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                          <div className="bg-main10 w-full px-3 py-3 text-white h-full rounded-sm break-all">
                            <textarea
                              className="w-full h-full resize-none bg-main10"
                              name=""
                              id=""
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setHasChanged(true);
                              }}
                            ></textarea>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "absolute w-full left-[50%] bg-black rounded-sm px-3 py-2 transition-all max-w-[800px] translate-x-[-50%] hidden bottom-[-100px]",
                      hasChanged && "block bottom-3 flyIn"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <p className="text-white pl-1">
                        Careful - You have unsaved changes!
                      </p>
                      <div>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            setHasChanged(false);
                          }}
                        >
                          Reset
                        </Button>
                        <Button size="custom">Save Changes</Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>

              <Separator className="my-7 bg-main06 w-full h-[1px]" />
              <div className="flex flex-col gap-y-6">
                <p className="text-xl font-semibold text-white">
                  Password and Session
                </p>
                <div>
                  <button className="text-white bg-indigo-500 rounded-sm px-3 text-sm h-[30px]">
                    Change Password
                  </button>
                </div>
                <div className="flex flex-col gap-y-3">
                  <p className="text-sm text-zinc-400">
                    Logged in on a public device? You can suspend all the active
                    sessions by pressing <br></br>the button below. This will
                    log you out of all the devices including this one.
                  </p>
                  <button className="max-w-fit text-white bg-indigo-500 rounded-sm px-3 text-sm h-[30px]">
                    Log Out all know devices
                  </button>
                </div>
              </div>
              <Separator className="my-7 bg-main06 w-full h-[1px]" />
              <div className="flex flex-col gap-y-3">
                <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                  Account Removal
                </p>
                <p className="text-sm text-zinc-400">
                  This will immediately log you out of your account and remove
                  your access completely.
                </p>
                <button className="max-w-fit text-white bg-red-600 rounded-sm px-3 text-sm h-[30px]">
                  Delete Account
                </button>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
