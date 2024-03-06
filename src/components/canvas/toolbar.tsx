import { Circle, Hand, MousePointer2, Square } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";

export function Toolbar() {
  return (
    <section className="fixed top-3 left-1/2 -translate-x-1/2 flex gap-2 p-1 border rounded-sm">
      <ToolbarButton name="Move" onClick={() => {}}>
        <Hand size={18} />
      </ToolbarButton>
      <ToolbarButton name="Select" onClick={() => {}}>
        <MousePointer2 size={18} />
      </ToolbarButton>
      <ToolbarButton name="Rectangle" onClick={() => {}}>
        <Square size={18} />
      </ToolbarButton>
      <ToolbarButton name="Ellipse" onClick={() => {}}>
        <Circle size={18} />
      </ToolbarButton>
    </section>
  );
}