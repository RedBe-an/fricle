/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { CarouselSpacing } from './snippets/carousel-cards'
import { IngredientInput } from './snippets/ing-input'

function App(): JSX.Element {
  return (
    <div className="flex  flex-col items-center justify-center p-12">
      <br />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Fricle</h1>
      <br />
      <IngredientInput></IngredientInput>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-4 mb-4">
        지금 인기있는 👀
      </h4>
      <CarouselSpacing></CarouselSpacing>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-4 mb-4">
        한 번 만들어보실래요?
      </h4>
      <CarouselSpacing></CarouselSpacing>
    </div>
  )
}

export default App
