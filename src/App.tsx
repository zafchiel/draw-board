import { ThemeSwicth } from "./components/ui/theme-switch"
import { GlobalProvider } from "./providers/global-provider"

function App() {


  return (
    <GlobalProvider>
      <div>
        YEY
        <ThemeSwicth />
      </div>
    </GlobalProvider>
  )
}

export default App
