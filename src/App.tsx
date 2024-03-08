import { Canvas } from "./components/canvas/canvas"
import { Toolbar } from "./components/canvas/toolbar"
import { ClearCanvas } from "./components/ui/clear-canvas"
import { ThemeSwicth } from "./components/ui/theme-switch"
import { GlobalProvider } from "./providers/global-provider"

function App() {


  return (
    <GlobalProvider>
      <ThemeSwicth />
      <Canvas />
      <Toolbar />
      <ClearCanvas />
    </GlobalProvider>
  )
}

export default App
