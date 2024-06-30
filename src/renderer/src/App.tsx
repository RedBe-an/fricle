/* eslint-disable @typescript-eslint/explicit-function-return-type */

import RecipeApp from './snippets/RecipeApp'

function App(): JSX.Element {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-0">
        <RecipeApp></RecipeApp>
      </div>
    </>
  )
}

export default App
