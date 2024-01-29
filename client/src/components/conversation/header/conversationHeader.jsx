import { ActionTooltip } from "@/components/actionTooltip";
import MobileToggle from "@/components/mobileToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import React from "react";

const ConversationHeader = () => {
  return (
    <div className="pl-4 text-md px-3 flex items-center h-[48px] border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle />
      <div className="group flex justify-between gap-x-2 w-full">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <Users className="h-5 w-5 text-zinc-400" />
            <p>Friends</p>
          </div>
          <Separator className="mt-[1px] h-5 w-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md m-1" />
          <ActionTooltip label="coming soon!">
            <div>
              <Button
                variant="custom"
                disabled="true"
                className="hover:bg-zinc-700/10 dark:hover:bg-zinc-600/50 dark:hover:text-zinc-200 transition px-2 rounded-sm text-zinc-400"
              >
                Online
              </Button>

              <Button
                variant="custom"
                disabled="true"
                className="hover:bg-zinc-700/10 dark:hover:bg-zinc-600/50 dark:hover:text-zinc-200 transition px-2 rounded-sm text-zinc-400"
              >
                All
              </Button>

              <Button
                variant="custom"
                disabled="true"
                className="hover:bg-zinc-700/10 dark:hover:bg-zinc-600/50 dark:hover:text-zinc-200 transition px-2 rounded-sm text-zinc-400"
              >
                Pending
              </Button>
            </div>
          </ActionTooltip>
        </div>
        <ActionTooltip label="coming soon!">
          <div className="flex gap-x-2 items-center justify-center">
            <Button
              variant="custom"
              disabled="true"
              className="hover:bg-zinc-700/10 dark:hover:bg-zinc-600/50 dark:hover:text-zinc-200 transition px-2 rounded-sm text-zinc-400"
            >
              Blocked
            </Button>
            <Button
              disabled="true"
              className="h-[30px] bg-emerald-600 text-sm font-medium rounded-sm px-3"
            >
              Add Friend
            </Button>
          </div>
        </ActionTooltip>
      </div>
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  );
};

export default ConversationHeader;
