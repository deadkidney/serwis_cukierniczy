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


describe('add and remove from favourites queries', () => {
    test('add and remove from favourites', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await expect(db.addLike(1, id)).resolves.toBeTruthy();

        await expect(db.deleteLike(1, id)).resolves.toBeTruthy();

        await db.deleteRecipe(id);
    });

    test('fail to add to favourites when user or recipe does not exist', async () => {
        let recipe = exRecipes[1];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await expect(db.addLike(notid, id)).rejects.toThrow("can't add like");

        await db.deleteRecipe(id);

        await expect(db.addLike(2, id)).rejects.toThrow("can't add like");
    });
});

describe('check favourites query', () => {
    test('checks if users have a given recipe in favourites', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        await db.addLike(1, id);

        await expect(db.getIsLiked(1, id)).resolves.toBe("1");
        await expect(db.getIsLiked(2, id)).resolves.toBe("0");
        await expect(db.getIsLiked(notid, id)).resolves.toBe("0");

        await db.deleteLike(1, id);

        await expect(db.getIsLiked(1, id)).resolves.toBe("0");
        
        await db.deleteRecipe(id);

        await expect(db.getIsLiked(1, id)).resolves.toBe("0");

    });
});