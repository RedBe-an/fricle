/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string[]
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch('resources/recipes.json')
        const data: Recipe[] = await response.json()
        const foundRecipe = data.find((recipe) => recipe.id === id)
        setRecipe(foundRecipe)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch recipe:', error)
      }
    }

    fetchRecipe()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!recipe) {
    return <div>Recipe not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{recipe.title}</h1>
      <h2 className="text-xl mt-4">Ingredients</h2>
      <ul className="list-disc list-inside">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2 className="text-xl mt-4">Instructions</h2>
      <ol className="list-decimal list-inside">
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </div>
  )
}

export default RecipeDetail
