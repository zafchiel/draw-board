import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ToolbarButtonProps = {
  children: React.ReactNode;
  name: string;
  onClick: () => void;
  selected?: boolean;
};

export function ToolbarButton({ name, onClick, children, selected }: ToolbarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={selected ? "default" : "ghost"} size="icon" onClick={onClick} >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="font-semibold">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
