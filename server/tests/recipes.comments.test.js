// test recipe database query functions
// assumes the database is not live (that nothing else uses the database) throughout the testing
// assumes there are at least three users in the database (id 1, 2 and 3) and there is no user with id = 9999999 in the database


import * as db from '../repository.js';


const exRecipes = [
    {title: "testRecipe1", user_id: 1, ingredients: '[{"id":1,"name":"ing1","amount":1,"unit":"i"}]', content: "lorem ipsum", portions: 1, tags: []}, 
    {title: "testRecipe2", user_id: 1, ingredients: '[{"id":1,"name":"ing1","amount":1,"unit":"i"},{"id":2,"name":"ing2","amount":"5.4","unit": "l"}]', content: "lorem ipsum dolor sit amet", portions: 2, tags: ["vegan", "vegetarian"]}, 
    {title: "testRecipe21", user_id: 3, ingredients: '[{"id": 1,"name":"ing1","amount":1,"unit":"i"},{"id":2,"name":"ing2","amount":"2","unit":"ml"}]', content: "aaa", portions: 10, tags: ["cake", "vegetarian"]}
];
const exComments = [
            {user_id: 1, content: "lorem ipsum"}, 
            {user_id: 2, content: "dolor sit amet"}, 
            {user_id: 2, content: "lorem ipsum"}, 
            {user_id: 1, content: "dolor sit amet"}
];
const notid=9999999


describe('add and remove comment queries', () => {
    test('add and remove comments', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        const comid1 = await db.addComment(1, id, "lorem ipsum");
        const comid2 = await db.addComment(2, id, "dolor sit amet");
        
        expect(comid1).toBeGreaterThan(0);
        expect(comid2).toBeGreaterThan(0);

        await expect(db.deleteComment(comid1)).resolves.toBeTruthy();
        await expect(db.deleteComment(comid2)).resolves.toBeTruthy();
        
        await db.deleteRecipe(id);
    });

    test('fail to add a comment when user or recipe does not exist', async () => {
        let recipe = exRecipes[1];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await expect(db.addComment(notid, id, "aaaaa")).rejects.toThrow("can't add comment");

        await db.deleteRecipe(id);

        await expect(db.addComment(2, id, "bbbbb")).rejects.toThrow("can't add comment");
    });
});


describe('reading comments queries', () => {
    test('read an author of a comment', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        const comid1 = await db.addComment(1, id, "lorem ipsum");
        const comid2 = await db.addComment(2, id, "dolor sit amet");
        
        await expect(db.getCommentAuthor(comid2)).resolves.toEqual(2);
        await expect(db.getCommentAuthor(comid1)).resolves.toEqual(1);
        
        await db.deleteComment(comid1);
        await db.deleteComment(comid2);
        await db.deleteRecipe(id);
    });

    //checks wether given data matches that of a comment
    const checkDataWithComment = (data, comment_id, comment) => {
        expect(data).toHaveProperty('id', comment_id);
        expect(data).toHaveProperty('user_id', comment.user_id);
        expect(data).toHaveProperty('content', comment.content);
        expect(data).toHaveProperty('username');
    }

    test('read a list of all comments under one recipe', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        let comments = await db.getCommentsByRecipe(id);
        expect(comments.length).toEqual(0);


        const n = exComments.length;
        let comid = [];

        for (let i = 0; i < n; i++){
            comid[i] = await db.addComment(exComments[i].user_id, id, exComments[i].content);
        }

        comments = await db.getCommentsByRecipe(id);
        expect(comments.length).toEqual(n);
   
        for (let i = 0; i < n; i++){
            checkDataWithComment(comments[i], comid[n-1-i], exComments[n-1-i]);
            await db.deleteComment(comid[n-1-i]);
        }

        comments = await db.getCommentsByRecipe(id);
        expect(comments.length).toEqual(0);


        await db.deleteRecipe(id);
    });
});