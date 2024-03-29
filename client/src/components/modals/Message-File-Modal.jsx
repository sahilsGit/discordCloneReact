import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModals";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {};

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-8 overflow-hidden bg-zinc-800 w-[400px]">
        <p className="py-6 text-center">
          Uploading files and images has been disabled temporarily to prevent
          abuse.
        </p>
      </DialogContent>
    </Dialog>
  );
};
