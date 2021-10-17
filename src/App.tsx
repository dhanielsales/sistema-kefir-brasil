import Root from './pages/Root'

import ThemeContainer from './contexts/theme/ThemeContainer'

export function App() {
  return (
    <>
      <ThemeContainer>
        <Root />
      </ThemeContainer>
    </>
  )
}