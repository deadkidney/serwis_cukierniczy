//otherQueries.tsx
//
// communication with the database server
// querries for recipes: favourites, ratings, comments and tags
//
//

import type { CommentData, LikeData, RatingData } from "../DataInterfaces";

//check whether the user has a recipe in their favourites
export const getIsLiked = async ({user_id, recipe_id, token} : {user_id: string, recipe_id: string, token: string}) => {
    const response = await fetch(`http://localhost:8080/api/likes?user=${user_id}&recipe=${recipe_id}`,
        {   
            headers: {
                'Authorization': `${token}`
            },
        }
    );
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

//add a recipe to user's favourties
export const addLike = async ({data, token} : {data: LikeData, token: string}) => {
    const response = await fetch("http://localhost:8080/api/likes",
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add like');
    }
    return true;
}

//remove a recipe from user's favourites
export const deleteLike = async ({data, token} : {data: LikeData, token: string}) => {
    const response = await fetch('http://localhost:8080/api/likes',
        {   method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('failed to delete like')
    }
    return true;
}

//get the user's rating of a recipe 
export const getRating = async ({user_id, recipe_id, token} : {user_id: string, recipe_id: string, token: string}) => {
    const response = await fetch(`http://localhost:8080/api/ratings/my?user=${user_id}&recipe=${recipe_id}`,
        {   headers: {
                'Authorization': `${token}`
            },
        }
    );
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

//get the average rating of a recipe
export const getRatingAverage = async (recipe_id: string) => {
    const response = await fetch(`http://localhost:8080/api/ratings/avg?recipe=${recipe_id}`);
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

//add a rating to a recipe
export const addRating = async ({data, token} : {data: RatingData, token: string}) => {
    const response = await fetch("http://localhost:8080/api/ratings",
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add rating');
    }
    return true;
}

//remove user's rating from a recipe
export const deleteRating = async ({data, token} : {data: LikeData, token: string}) => {
    const response = await fetch('http://localhost:8080/api/ratings',
        {   method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('failed to delete rating')
    }
    return true;
}

//get the list of all comments of a recipe
export const getCommentsByRecipe = async (recipe_id : string) => {
    const response = await fetch(`http://localhost:8080/api/comments?recipe=${recipe_id}`);
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

//add a comment to a recipe
export const addComment = async ({data, token} : {data: CommentData, token: string}) => {
    const response = await fetch("http://localhost:8080/api/comments",
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add comment');
    }
    return true;
}

//delete a comment from a recipe
export const deleteComment = async ({id, token} : {id: string, token: string}) => {
    const response = await fetch(`http://localhost:8080/api/comments?id=${id}`,
        {   method: 'DELETE',
            headers: {
                'Authorization': `${token}`
            },
        }
    );
    if (!response.ok) {
        throw new Error('failed to delete comment')
    }
    return true;
}

//get the list of all tags
export const getTags = async () => {
    const response = await fetch("http://localhost:8080/api/tags");
    if (!response.ok) {
            throw new Error('no tags');
    }
    return response.json();
}