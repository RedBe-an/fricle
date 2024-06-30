import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
