import { ActionTooltip } from "@/components/actionTooltip";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import useServer from "@/hooks/useServer";
import useChannels from "@/hooks/useChannels";
import { memo } from "react";

/*
 * NavigationConversation
 *
 * Represents the topMost button on the Navigation Sidebar.
 * Takes the user to conversations page thereby giving a "conversation" "type".
 * Opens up either "friends" section or "current-chat" (if activeConversation exists)
 * Is memoized to prevent re-render when other non-critical states change
 *
 *
 */

const NavigationConversation = memo(
  ({ activeConversation, type, theme, profileId }) => {
    // Custom state hooks
    const serverDispatch = useServer("dispatch");
    const channelsDispatch = useChannels("dispatch");
    const navigate = useNavigate();

    return (
      <>
        <button
          onClick={() => {
            // Cache server and channel state before taking the user to conversation page
            serverDispatch({ type: "ADD_TO_CACHE" });
            channelsDispatch({ type: "ADD_TO_CACHE" });

            // If activeConversation exists
            if (activeConversation?.id) {
              // No need to fetch simply navigate the user to that chat page
              navigate(
                `/@me/conversations/${activeConversation.profileId}/${profileId}`
              );
            } else {
              // Open up the friends sub-section
              navigate("/@me/conversations");
            }
          }}
          className="group w-full relative flex justify-center items-center"
        >
          <div
            className={cn(
              "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
              type === "channel" && "group-hover:h-[20px]",
              type === "conversation" && "h-[36px]",
              type === "channel" && "h-[8px]"
            )}
          ></div>
          <ActionTooltip side="right" align="center" label="Direct Messages">
            <div
              className={cn(
                "relative flex items-center justify-center h-[48px] w-[48px] rounded-[24px] overflow-hidden group-hover:rounded-[16px] transition-all bg-main07 group-hover:bg-indigo-500",
                type === "conversation" && "rounded-[16px] bg-indigo-500"
              )}
            >
              {theme === "light" ? (
                <img
                  src="/logos/icon_clyde_black_RGB.svg"
                  alt=""
                  className={cn(
                    "h-7 w-7 group-hover:invert transition-all",
                    type === "conversation" && "invert"
                  )}
                />
              ) : (
                <img
                  src="/logos/icon_clyde_white_RGB.svg"
                  alt=""
                  className="h-7 w-7"
                />
              )}
            </div>
          </ActionTooltip>
        </button>
      </>
    );
  }
);

export default NavigationConversation;
