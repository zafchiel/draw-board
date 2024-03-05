import { createContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    localStorageKey?: string;
}

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const initState: ThemeProviderState = {
    theme: "system",
    setTheme: () => {},
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initState);

export function ThemeProvider({ children, defaultTheme = "system", localStorageKey = "draw-board-ui-theme", ...props }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(localStorageKey) as Theme) || defaultTheme
    );

    useEffect(() => {
        console.log("provider use effect", theme)
        const documentElement = window.document.documentElement;

        documentElement.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";

            documentElement.classList.add(systemTheme);
            return;
        }

        documentElement.classList.add(theme);
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            console.log("setting theme", theme)
            localStorage.setItem(localStorageKey, theme);
            setTheme(theme);
        }
    }

    return <ThemeProviderContext.Provider {...props} value={value} >
        {children}
    </ThemeProviderContext.Provider>
}
