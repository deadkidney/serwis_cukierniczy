import type { RecipeData } from "../DataInterfaces";

export const getRecipes = async (search: string, tags: string[], page: number, limit: number) => {
    const response = await fetch(`http://localhost:8080/api/recipes/filtered?search=${search}&tags=${tags}&page=${page}&limit=${limit}`);
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

export const getRecipesByAuthor = async (author_id: string, page: number, limit: number) => {
    const response = await fetch(`http://localhost:8080/api/recipes/authored?author=${author_id}&page=${page}&limit=${limit}`);
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

export const getLikedRecipes = async (user_id: string, page: number, limit: number) => {
    const response = await fetch(`http://localhost:8080/api/recipes/liked?user=${user_id}&page=${page}&limit=${limit}`);
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

export const addRecipe = async ({recipe, token} : {recipe: RecipeData, token: string}) => {
    const response = await fetch("http://localhost:8080/api/recipes",
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(recipe),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add recipe');
    }
    return response.json();
}

export const updateRecipe = async ({recipe, token} : {recipe: RecipeData, token: string}) => {
    const response = await fetch(`http://localhost:8080/api/recipeinfo?id=${recipe.id}`,
        {   method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(recipe),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add recipe');
    }
    return true;
}

export const deleteRecipe = async ({id, token} : {id: string, token: string}) => {
    const response = await fetch(`http://localhost:8080/api/recipeinfo?id=${id}`,
        {   method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        }
    );
    if (!response.ok) {
        throw new Error('failed to delete recipe')
    }
    return true;
}

