/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

export function IngredientInput() {
  const [inputValue, setInputValue] = useState<string>('')
  const [, setList] = useState<string[]>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleButtonClick = () => {
    const newList = inputValue.split(',').map((item) => item.trim())
    setList(newList)
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input value={inputValue} onChange={handleInputChange} placeholder="재료를 입력해주세요!" />
      <Button onClick={handleButtonClick} type="submit">
        찾아보기
      </Button>
    </div>
  )
}
