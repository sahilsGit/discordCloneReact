import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModals";
import { post } from "@/services/api-service";
import useAuth from "@/hooks/useAuth";
import { EmojiPicker } from "../emojiPicker";

// Message schema
const formSchema = z.object({
  content: z.string().min(1),
});

const MainInput = ({ apiUrl, query }) => {
  /*
   *
   * Renders Input area that's used to write messages
   * Handles message sending logic for both "channel" & "conversation" type.
   *
   */
  const { onOpen } = useModal(); // To open the file upload modal
  const access_token = useAuth("token");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value) => {
    // Sends message, message type depends on qpiUrl prop
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await post(url, JSON.stringify(value), access_token);
      form.reset();
    } catch (error) {
      // Ingulf error
    }
  };
  return (
    <div className="px-3 pb-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex bg-zinc-200/90 dark:bg-zinc-700 border-none border-0 text-zinc-600 dark:text-zinc-200 rounded-sm">
                    <button
                      type="button"
                      onClick={() => onOpen("messageFile", "")}
                      className="h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 mx-[10px] my-[12px] flex items-center justify-center"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      disabled={isLoading}
                      className="flex-1 bg-zinc-200/90 dark:bg-zinc-700 border-none border-0 text-zinc-600 dark:text-zinc-200 focus-visible:outline-auto focus-visible:ring-0 focus-visible:ring-offset-0
                      "
                      placeholder="Enter your message"
                      {...field}
                    />
                    <button
                      type="button"
                      className="h-[24px] w-[24px] transition rounded-full flex items-center justify-center mx-[10px] my-[12px] "
                    >
                      <EmojiPicker
                        onChange={(emoji) =>
                          field.onChange(`${field.value}${emoji}`)
                        }
                      />
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default MainInput;
