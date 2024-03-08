import { Button } from "./button";
import { Hint } from "./hint";

type ToolbarButtonProps = {
  children: React.ReactNode;
  name: string;
  onClick: () => void;
  selected?: boolean;
};

export function ToolbarButton({
  name,
  onClick,
  children,
  selected,
  ...props
}: ToolbarButtonProps) {
  return (
    <Hint name={name} side="bottom">
      <Button
        variant={selected ? "default" : "ghost"}
        size="icon"
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </Hint>
  );
}
