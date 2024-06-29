/* eslint-disable @typescript-eslint/explicit-function-return-type */

import RecipeApp from './snippets/RecipeAppv2'

function App(): JSX.Element {
  return (
    <>
      <div className="flex  flex-col items-center justify-center p-12">
        <RecipeApp></RecipeApp>
      </div>
    </>
  )
}

export default App
