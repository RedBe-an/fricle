/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { CarouselSpacing } from './carousel-cards'

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string[]
}

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Bolognese',
    ingredients: ['ground beef', 'onion', 'garlic', 'tomatoes', 'spaghetti'],
    instructions: [
      'Cook the spaghetti',
      'Make the Bolognese sauce',
      'Serve the spaghetti with the sauce'
    ]
  },
  {
    id: '2',
    title: 'Grilled Chicken Salad',
    ingredients: ['chicken breasts', 'lettuce', 'tomatoes', 'cucumbers', 'olive oil'],
    instructions: ['Grill the chicken', 'Prepare the salad', 'Combine the chicken and salad']
  },
  {
    id: '3',
    title: 'Vegetable Stir-Fry',
    ingredients: ['broccoli', 'carrots', 'bell peppers', 'garlic', 'soy sauce'],
    instructions: [
      'Prepare the vegetables',
      'Heat the oil in a pan',
      'Stir-fry the vegetables',
      'Add the sauce'
    ]
  }
]

const columns: ColumnDef<Recipe>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="capitalize">{row.getValue('title')}</div>
  },
  {
    accessorKey: 'ingredients',
    header: 'Ingredients',
    cell: ({ row }) => (
      <div className="lowercase">{(row.getValue('ingredients') as string[]).join(', ')}</div>
    )
  },
  {
    accessorKey: 'instructions',
    header: 'Instructions',
    cell: ({ row }) => (
      <div>
        {(row.getValue('instructions') as string[]).map((instruction, index) => (
          <div key={index}>
            {index + 1}. {instruction}
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const recipe = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(recipe.id)}>
              Copy Recipe ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Recipe Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

const IngredientInput = ({ onSearch }: { onSearch: (ingredients: string[]) => void }) => {
  const [inputValue, setInputValue] = useState<string>('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleButtonClick = () => {
    const ingredients = inputValue.split(',').map((item) => item.trim())
    onSearch(ingredients)
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder="', '로 구분해 재료를 입력해주세요!"
      />
      <Button onClick={handleButtonClick} type="submit">
        찾아보기
      </Button>
    </div>
  )
}

const DataTableDemo = ({ recipes }: { recipes: Recipe[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data: recipes,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting
    }
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

const RecipeApp: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = (searchedIngredients: string[]) => {
    const filteredRecipes = sampleRecipes.filter((recipe) =>
      searchedIngredients.every((ingredient) => recipe.ingredients.includes(ingredient))
    )
    setRecipes(filteredRecipes)
    setSearched(true)
  }

  return (
    <div className="flex flex-col items-center justify-center p-0">
      <br />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-10 pt-0">
        Fricle
      </h1>
      <IngredientInput onSearch={handleSearch} />
      <div className="mt-2 w-full max-w-3xl mb-10">
        {searched && <DataTableDemo recipes={recipes} />}
      </div>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">지금 인기있는 👀</h4>
      <CarouselSpacing></CarouselSpacing>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-4 mb-4">
        한 번 만들어보실래요?
      </h4>
      <CarouselSpacing></CarouselSpacing>
    </div>
  )
}

export default RecipeApp
