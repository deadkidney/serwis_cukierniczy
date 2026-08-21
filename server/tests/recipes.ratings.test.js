// test recipe database query functions
// assumes the database is not live (that nothing else uses the database) throughout the testing
// assumes there are at least three users in the database (id 1, 2 and 3) and there is no user with id = 9999999 in the database

import * as db from '../repository.js';


const exRecipes = [
    {title: "testRecipe1", user_id: 1, ingredients: '[{"id":1,"name":"ing1","amount":1,"unit":"i"}]', content: "lorem ipsum", portions: 1, tags: []}, 
    {title: "testRecipe2", user_id: 1, ingredients: '[{"id":1,"name":"ing1","amount":1,"unit":"i"},{"id":2,"name":"ing2","amount":"5.4","unit": "l"}]', content: "lorem ipsum dolor sit amet", portions: 2, tags: ["vegan", "vegetarian"]}, 
    {title: "testRecipe21", user_id: 3, ingredients: '[{"id": 1,"name":"ing1","amount":1,"unit":"i"},{"id":2,"name":"ing2","amount":"2","unit":"ml"}]', content: "aaa", portions: 10, tags: ["cake", "vegetarian"]}
];
const notid=9999999


describe('add and remove rating queries', () => {
    test('add and remove ratings', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await expect(db.addRating(1, id, 3)).resolves.toBeTruthy();
        await expect(db.addRating(2, id, 5)).resolves.toBeTruthy();

        await expect(db.deleteRating(2, id)).resolves.toBeTruthy();
        await expect(db.deleteRating(1, id)).resolves.toBeTruthy();
        
        await db.deleteRecipe(id);
    });

    test('fail to add a rating when user or recipe does not exist', async () => {
        let recipe = exRecipes[1];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await expect(db.addRating(notid, id, 3)).rejects.toThrow("can't add rating");

        await db.deleteRecipe(id);

        await expect(db.addRating(2, id, 1)).rejects.toThrow("can't add rating");
    });
});


describe('reading ratings queries', () => {
    test('read user rating', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await db.addRating(1, id, 1);
        await db.addRating(2, id, 2);
        
        await expect(db.getRating(1, id)).resolves.toEqual(1);
        await expect(db.getRating(2, id)).resolves.toEqual(2);

        await db.deleteRating(1, id);
        await db.addRating(1, id, 4);

        await expect(db.getRating(1, id)).resolves.toEqual(4);
        
        await db.deleteRating(1, id);
        await db.deleteRating(2, id);
        await db.deleteRecipe(id);
    });

    test('read average rating', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await db.addRating(1, id, 3);
        await db.addRating(2, id, 5);
        
        let avg = parseFloat(await db.getRatingAverage(id));
        expect(avg).toBeCloseTo(4);

        await db.deleteRating(2, id);
        await db.addRating(2, id, 4);

        avg = parseFloat(await db.getRatingAverage(id));
        expect(avg).toBeCloseTo(3.5);

        await db.deleteRating(1, id);
        await db.deleteRating(2, id);
        await expect(db.getRatingAverage(id)).resolves.toBeNull();
        await db.deleteRecipe(id);
        await expect(db.getRatingAverage(id)).resolves.toBeNull();
    });

    test('get users rating returns 0 on invalid data', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await db.addRating(1, id, 2);

        await expect(db.getRating(notid, id)).resolves.toBe(0);

        await db.deleteRating(1, id);
        await db.deleteRecipe(id);

        await expect(db.getRating(1, id)).resolves.toBe(0);
    });
});