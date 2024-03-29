import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";
import React, { memo } from "react";

const ServerHeader = memo(({ type, activeChannel, activeConversation }) => {
  let name;

  if (type === "channel") {
    name = activeChannel.name;
  } else {
    name = activeConversation.theirName;
  }

  return (
    <div className="pl-14 max-w-[1224px] lg:pl-1 text-md px-3 flex items-center h-[48px] border-neutral-200 dark:border-neutral-800 border-b-2">
      {(type === "channel" || type === "server") && (
        <Hash className="lg:ml-2 w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-1" />
      )}
      <div className="flex justify-between overflow-hidden truncate w-full">
        <p
          className={cn(
            "font-semibold text-md text-black dark:text-white",
            type === "conversation" && "lg:pl-3"
          )}
        >
          {name}
        </p>
      </div>
    </div>
  );
});

export default ServerHeader;
