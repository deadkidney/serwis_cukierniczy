export const getAllUsers = async (token: string) => {
    const response = await fetch("http://localhost:8080/api/users",
        {   headers: {
                'Authorization': `${token}`
            },
        }
    );
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

export const changeRole = async ({id, token} : {id: string, token: string}) => {
    const response = await fetch(`http://localhost:8080/api/userinfo?id=${id}`,
        {   method: 'PUT',
            headers: {
                'Authorization': `${token}`
            },
        }
    );
    if (!response.ok) {
        throw new Error('failed to add recipe');
    }
    return true;
}

export const deleteUser = async ({id, token} : {id: string, token: string}) => {
    const response = await fetch(`http://localhost:8080/api/userinfo?id=${id}`,
        {   method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        }
    );
    if (!response.ok) {
        throw new Error('failed to delete user')
    }
    return true;
}