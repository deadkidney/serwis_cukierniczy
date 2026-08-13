import type { CommentData, LikeData, RatingData } from "../DataInterfaces";

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

export const getRatingAverage = async (recipe_id: string) => {
    const response = await fetch(`http://localhost:8080/api/ratings/avg?recipe=${recipe_id}`);
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

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

export const getCommentsByRecipe = async (recipe_id : string) => {
    const response = await fetch(`http://localhost:8080/api/comments?recipe=${recipe_id}`);
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

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

export const getTags = async () => {
    const response = await fetch("http://localhost:8080/api/tags");
    if (!response.ok) {
            throw new Error('no tags');
    }
    return response.json();
}