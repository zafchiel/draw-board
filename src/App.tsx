import { Canvas } from "./components/canvas/canvas"
import { Toolbar } from "./components/canvas/toolbar"
import { ThemeSwicth } from "./components/ui/theme-switch"
import { GlobalProvider } from "./providers/global-provider"

function App() {


  return (
    <GlobalProvider>
        <ThemeSwicth />
      <Canvas />
      <Toolbar />
    </GlobalProvider>
  )
}

export default App
