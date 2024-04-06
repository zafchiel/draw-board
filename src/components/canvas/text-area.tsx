import { LayerType } from "@/lib/types";
import { CanvasStateContext } from "@/providers/canvas-state-provider";
import { useContext, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid/non-secure";

type TextAreaProps = {
  top: number;
  left: number;
  visible: boolean;
};

export const TextArea = (props: TextAreaProps) => {
  const [text, setText] = useState<string>("");
  const { layers, setLayers, canvasState } = useContext(CanvasStateContext);
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (text !== "") {
      setLayers([
        ...layers,
        {
          id: nanoid(),
          type: LayerType.Text,
          x: props.left - canvasState.cameraX,
          y: props.top - canvasState.cameraY,
          width: 100,
          height: 100,
          fill: canvasState.currentFillColor,
          stroke: canvasState.currentStrokeColor,
          points: null,
          isActive: true,
          innerText: text,
        },
      ]);
    }

    ref.current?.focus();
    setText("");
  }, [
    props.left,
    props.top,
    props.visible,
    canvasState.cameraX,
    canvasState.cameraY,
    canvasState.currentFillColor,
    canvasState.currentStrokeColor,
    layers,
    setLayers,
  ]);

  return (
    <textarea
      ref={ref}
      value={text}
      onChange={handleChange}
      className="canvas-text-area"
      style={{
        position: "absolute",
        top: props.top,
        left: props.left,
        visibility: props.visible ? "visible" : "hidden",
      }}
    />
  );
};
