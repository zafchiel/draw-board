import { Button } from "./button";
import { useTheme } from "@/lib/utils";

export function ThemeSwicth() {
  const { setTheme } = useTheme();

  return (
    <div>
      <Button
        onClick={() => {
          localStorage.setItem("theme", "system");
        }}
      >
        system
      </Button>
      <Button
        onClick={() => {
          console.log("setting theme", "dark");
          setTheme("dark");
        }}
      >
        Dark
      </Button>
      <Button
        onClick={() => {
          setTheme("light");
          console.log("setting theme", "light");
        }}
      >
        Light
      </Button>
    </div>
  );
}
