//userQueries.tsx
//
// communication with the database server
// user data and management queries
//
//

//get the list of all users. With pagination
export const getAllUsers = async (page: number, limit: number, token: string) => {
    const response = await fetch(`http://localhost:8080/api/users?page=${page}&limit=${limit}`,
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

//get username of a user
export const getUserById = async (id : string) => {
    const response = await fetch(`http://localhost:8080/api/userinfo?id=${id}`);
    if (!response.ok) {
            throw new Error('no user');
    }
    return response.json();
}

//change a user's role to admin. Admin only
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

//delete a user
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