import * as db from '../repository.js';
import * as auth from '../authentication.js';

const users = [
    {username: "unitTestUser1", password: "testPassword1"}, 
    {username: "unitTestUser2", password: "testPassword2"}, 
];

describe('register, login and delete user queries', () => {
    test('register and remove users', async () => {
        let data = await auth.register(users[0].username, users[0].password);
        expect(data).toHaveProperty('id');
        expect(data.id).toBeGreaterThan(0);
        expect(data).toHaveProperty('username', users[0].username);
        expect(data).toHaveProperty('role', "USER");
        expect(data).toHaveProperty('token');
        
        await expect(db.deleteUser(data.id)).resolves.toBeTruthy();
    });
    test('fail to register a user with the same username', async () => {
        let data = await auth.register(users[1].username, users[1].password);
        await expect(auth.register(users[1].username, "newpassword123")).rejects.toThrow("can't register");
        
        await expect(db.deleteUser(data.id)).resolves.toBeTruthy();
    });
    test('login as a registered user', async () => {
        await auth.register(users[0].username, users[0].password);
        let data = await auth.login(users[0].username, users[0].password);

        expect(data).toHaveProperty('id');
        expect(data.id).toBeGreaterThan(0);
        expect(data).toHaveProperty('username', users[0].username);
        expect(data).toHaveProperty('role', "USER");
        expect(data).toHaveProperty('token');

        
        await expect(db.deleteUser(data.id)).resolves.toBeTruthy();
    });
    test('fail to login with invalid credentials', async () => {
        let data =await auth.register(users[0].username, users[0].password);
        
        await expect(auth.login(users[1].username, users[1].password)).rejects.toThrow("can't log in");

        await expect(auth.login(users[1].username, users[0].password)).rejects.toThrow("can't log in");
        
        await expect(auth.login(users[0].username, users[1].password)).rejects.toThrow("can't log in");
        
        await expect(auth.login(users[0].username, "newpassword123")).rejects.toThrow("can't log in");
        
        await expect(db.deleteUser(data.id)).resolves.toBeTruthy();
    });
});

describe('read user queries', () => {
    test('read user data', async () => {
        let data = await auth.register(users[0].username, users[0].password);
        let data2 = await db.getUserById(data.id);
        expect(data2).toHaveProperty('id', data.id);
        expect(data2).toHaveProperty('username', users[0].username);
        
        await expect(db.deleteUser(data.id)).resolves.toBeTruthy();
    });
    test('read a list of all users', async () => {
        let n = parseInt(await db.getUsersAmount())
        let data1 = await auth.register(users[0].username, users[0].password);
        let data2 = await auth.register(users[1].username, users[1].password);
        
        await expect(db.getUsersAmount()).resolves.toEqual(String(n+2));
        let readUsers = await db.getUsers(0, 10);
        expect(readUsers).toContainEqual({id: data1.id, username: users[0].username, role: 'USER'});
        expect(readUsers).toContainEqual({id: data2.id, username: users[1].username, role: 'USER'});
        
        await expect(db.deleteUser(data1.id)).resolves.toBeTruthy();
        await expect(db.deleteUser(data2.id)).resolves.toBeTruthy();
    });
});



