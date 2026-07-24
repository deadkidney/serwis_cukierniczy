import type { RecipeData } from "../DataInterfaces";

export const getAllRecipes = async () => {
    const response = await fetch("http://localhost:8080/api/recipes");
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

export const getRecipeById = async (id : string) => {
    const response = await fetch(`http://localhost:8080/api/recipeinfo?id=${id}`);
    if (!response.ok) {
        throw new Error('no recipe');
    }
    return response.json();
}

export const getRecipesByAuthor = async (author_id: string) => {
    const response = await fetch(`http://localhost:8080/api/recipes/authored?author=${author_id}`);
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

export const getLikedRecipes = async (user_id: string) => {
    const response = await fetch(`http://localhost:8080/api/recipes/liked?user=${user_id}`);
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

export const addRecipe = async (recipe: RecipeData) => {
    const response = await fetch("http://localhost:8080/api/recipes",
        {   method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recipe),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add recipe');
    }
    return true;
}

export const updateRecipe = async (recipe: RecipeData) => {
    const response = await fetch(`http://localhost:8080/api/recipeinfo?id=${recipe.id}`,
        {   method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recipe),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add recipe');
    }
    return true;
}

export const deleteRecipe = async (id: string) => {
    const response = await fetch(`http://localhost:8080/api/recipeinfo?id=${id}`,
        { method: 'DELETE' }
    );
    if (!response.ok) {
        throw new Error('failed to delete recipe')
    }
    return true;
}

