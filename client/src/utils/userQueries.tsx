export const getAllUsers = async () => {
    const response = await fetch("http://localhost:8080/api/users");
    if (!response.ok) {
            throw new Error('failed to find users');
    }
    return response.json();
}

export const getUserById = async (id : string) => {
    const response = await fetch(`http://localhost:8080/api/userinfo?id=${id}`);
    if (!response.ok) {
            throw new Error('no user');
    }
    return response.json();
}
