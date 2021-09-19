import Root from './pages/Root'
import Teste from './pages/Teste'

import ThemeContainer from './contexts/theme/ThemeContainer'

export function App() {
  return (
    <>
      <ThemeContainer>
        <Teste />
      </ThemeContainer>
    </>
  )
}