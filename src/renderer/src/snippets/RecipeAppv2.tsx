/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'

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

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string[]
}

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
      <div className="lowercase">
        {row.getValue('ingredients').slice(0, 5).join(', ')}
        {row.getValue('ingredients').length > 5 && '...'}
      </div>
    )
  },
  {
    accessorKey: 'instructions',
    header: 'Instructions',
    cell: ({ row }) => (
      <div>
        {row
          .getValue('instructions')
          .slice(0, 3)
          .map((instruction, index) => (
            <div key={index}>
              {index + 1}. {instruction}
            </div>
          ))}
        {row.getValue('instructions').length > 3 && '...'}
      </div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const recipe = row.original
      const navigate = useNavigate()

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
            <DropdownMenuItem onClick={() => navigate(`/recipe/${recipe.id}`)}>
              View Recipe Details
            </DropdownMenuItem>
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
      <Input value={inputValue} onChange={handleInputChange} placeholder="재료를 입력해주세요!" />
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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/recipes.json')
        const data = await response.json()
        setRecipes(data)
      } catch (error) {
        console.error('Failed to fetch recipes:', error)
      }
    }

    fetchRecipes()
  }, [])

  const handleSearch = (searchedIngredients: string[]) => {
    const filteredRecipes = recipes.filter((recipe) =>
      searchedIngredients.every((ingredient) => recipe.ingredients.includes(ingredient))
    )
    setRecipes(filteredRecipes)
    setSearched(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <br />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-10 pt-0">
        Fricle
      </h1>
      <IngredientInput onSearch={handleSearch} />
      <div className="mt-4 w-full max-w-3xl">{searched && <DataTableDemo recipes={recipes} />}</div>
    </div>
  )
}

export default RecipeApp