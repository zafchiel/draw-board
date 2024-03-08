import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ToolbarButtonProps = {
  children: React.ReactNode;
  name: string;
  side: "left" | "right" | "top" | "bottom";
};

export function Hint({ name, children, side = "bottom" }: ToolbarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            {children}
        </TooltipTrigger>
        <TooltipContent side={side} className="font-semibold">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
