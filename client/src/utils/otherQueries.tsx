export const getLikesAmount = async (recipe : string) => {
    const response = await fetch(`http://localhost:8080/api/likes?recipe=${recipe}`);
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}

export const getCommentsByRecipe = async (recipe : string) => {
    const response = await fetch(`http://localhost:8080/api/comments?recipe=${recipe}`);
    if (!response.ok) {
            throw new Error('no recipe');
    }
    return response.json();
}