import type { CommentData, LikeData } from "../DataInterfaces";

export const getLikesAmount = async (recipe : string) => {
    const response = await fetch(`http://localhost:8080/api/likes?recipe=${recipe}`);
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

export const addLike = async (data: LikeData) => {
    const response = await fetch("http://localhost:8080/api/likes",
        {   method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add like');
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

export const addComment = async (data: CommentData) => {
    const response = await fetch("http://localhost:8080/api/comments",
        {   method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('failed to add comment');
    }
    return true;
}