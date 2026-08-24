//recipeQueries.tsx
//
// communication with the database server
// recipe and recipes list queries
//
//


import type { RecipeData } from "../DataInterfaces";

//get a list of accepted recipes, filtered by tags and title. With pagination
export const getRecipes = async (search: string, tags: string[], page: number, limit: number) => {
    const response = await fetch(`http://localhost:8080/api/recipes/filtered?search=${search}&tags=${tags}&page=${page}&limit=${limit}`);
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

//get a list of recipes by a given author. With pagination
export const getRecipesByAuthor = async (author_id: string, page: number, limit: number) => {
    const response = await fetch(`http://localhost:8080/api/recipes/authored?author=${author_id}&page=${page}&limit=${limit}`);
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

//get a list of user's favourite recipes. With pagination
export const getFavouriteRecipes = async (user_id: string, page: number, limit: number) => {
    const response = await fetch(`http://localhost:8080/api/recipes/favourite?user=${user_id}&page=${page}&limit=${limit}`);
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

//get a list of all not accepted recipes. Admin only. With pagination
export const getNotAcceptedRecipes = async (page: number, limit: number, token: string) => {
    const response = await fetch(`http://localhost:8080/api/recipes/notaccepted?page=${page}&limit=${limit}`,
        {   headers: {
                'Authorization': `${token}`
            },
        }
    );
    if (!response.ok) {
            throw new Error('failed to find recipes');
    }
    return response.json();
}

//get all data of a recipe by id
export const getRecipeById = async (id : string) => {
    const response = await fetch(`http://localhost:8080/api/recipeinfo?id=${id}`);
    if (!response.ok) {
        throw new Error('no recipe');
    }
    return response.json();
}

//add a new recipe
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

//update a recipe by id
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
        throw new Error('failed to update recipe');
    }
    return true;
}

//delete a recipe by id
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

