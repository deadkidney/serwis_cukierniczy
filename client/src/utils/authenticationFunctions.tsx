import type { UserShort } from "../DataInterfaces";

export const register = async (user: UserShort) => {
    const response = await fetch("http://localhost:8080/api/register",
        {   method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user),
        }
    );
    if (!response.ok) {
        throw new Error('failed to register');
    }
    return response.json();
}

export const login = async (user: UserShort) => {
    const response = await fetch("http://localhost:8080/api/login",
        {   method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user),
        }
    );
    if (!response.ok) {
        throw new Error('failed to log in');
    }
    return response.json();
}