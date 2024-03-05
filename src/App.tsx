import { GlobalProvider } from "./providers/global-provider"
import { Button } from "./components/ui/button"
import { useTheme } from "./providers/theme-provider"

function App() {
  const theme = useTheme()
  return (
    <GlobalProvider>
      <div>
        YEY
        <Button onClick={() => {
          theme.setTheme("system")
        }}>system</Button>
        <Button onClick={() => {
          theme.setTheme("dark")
        }}>Dark</Button>
        <Button onClick={() => {
          theme.setTheme("light")
        }}>Light</Button>
      </div>
    </GlobalProvider>
  )
}

export default App
