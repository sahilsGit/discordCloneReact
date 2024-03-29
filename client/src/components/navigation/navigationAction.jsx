import { Plus } from "lucide-react";
import { ActionTooltip } from "../actionTooltip";
import { useModal } from "@/hooks/useModals";

/*
 * NavigationAction
 *
 * Button to open up the CreateServer modal
 * Uses Zustand for modal management
 *
 */

const NavigationAction = () => {
  // Custom Zustand hook
  const { onOpen } = useModal();

  return (
    <button
      className="w-full flex items-center justify-center group relative"
      // Open createServer modal
      onClick={() => onOpen("createServer", "")}
    >
      <ActionTooltip side="right" align="center" label="Add a server">
        <div className="flex items-center justify-center h-[48px] w-[48px] rounded-[24px] overflow-hidden group-hover:rounded-[16px] transition-all bg-main07 group-hover:bg-emerald-500">
          <Plus
            className="group-hover:text-white transition text-emerald-500"
            size={25}
            strokeWidth={1.5}
          />
        </div>
      </ActionTooltip>
    </button>
  );
};

export default NavigationAction;
