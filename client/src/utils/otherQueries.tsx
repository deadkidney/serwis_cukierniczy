import type { CommentData, LikeData } from "../DataInterfaces";

export const getLikesByRecipe = async (recipe : string) => {
    const response = await fetch(`http://localhost:8080/api/likes?recipe=${recipe}`);
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


export const getCommentsByRecipe = async (recipe : string) => {
    const response = await fetch(`http://localhost:8080/api/comments?recipe=${recipe}`);
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