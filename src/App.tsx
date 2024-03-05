import { Canvas } from "./components/canvas/canvas"
import { ThemeSwicth } from "./components/ui/theme-switch"
import { GlobalProvider } from "./providers/global-provider"

function App() {


  return (
    <GlobalProvider>
        <ThemeSwicth />
      <Canvas />
    </GlobalProvider>
  )
}

export default App
