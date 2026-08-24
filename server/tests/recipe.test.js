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


describe('queries for adding and removal of recipes', () => {
    test('add and remove recipes', async () => {
        let recipe = exRecipes[0];
        const id0 = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        expect(id0).toBeGreaterThan(0);
        recipe = exRecipes[1];
        const id1 = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        expect(id1).toBeGreaterThan(0);
        await expect(db.deleteRecipe(id0)).resolves.toBeTruthy();
        recipe = exRecipes[2];
        const id2 = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        expect(id2).toBeGreaterThan(0);
        await expect(db.deleteRecipe(id2)).resolves.toBeTruthy();
        await expect(db.deleteRecipe(id1)).resolves.toBeTruthy();
        
    });

    test('fail to add a recipe if the given user does not exist', async () => {
        let recipe = exRecipes[0];
        await expect(db.createRecipe(recipe.title, notid, recipe.ingredients, recipe.content, recipe.portions, recipe.tags))
            .rejects.toThrow("can't create recipe");
        
    });

    test('remove recipes with dependencies', async () => {
        let recipe = exRecipes[2];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        await db.addComment(1, id, "lorem ipsum");
        await db.addComment(2, id, "dolor sit amet");
        await db.addFavourite(2, id);
        await db.addRating(1, id, 4);

        await expect(db.deleteRecipe(id)).resolves.toBeTruthy();
    });
});

//checks if the data is the same as that of a given recipe
const checkDataWithRecipe = (data, recipe, recipe_id, accepted=false) => {
    expect(data).toHaveProperty('id', recipe_id);
    expect(data).toHaveProperty('title', recipe.title);
    expect(data).toHaveProperty('user_id', recipe.user_id);
    expect(data).toHaveProperty('username');
    expect(data).toHaveProperty('ingredients', recipe.ingredients);
    expect(data).toHaveProperty('content', recipe.content);
    expect(data).toHaveProperty('portions', recipe.portions);
    expect(data).toHaveProperty('tags', recipe.tags);
    expect(data).toHaveProperty('accepted', accepted);
}


describe('recipe reading query', ()=>{
    test('reads all fields of a recipe', async () => {
        let recipe = exRecipes[1];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        
        const data = await db.getRecipeById(id);
        checkDataWithRecipe(data, recipe, id);
        
        await db.deleteRecipe(id);
    });

    test('fails when recipe does not exist', async () => {
        let recipe = exRecipes[1];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        await db.deleteRecipe(id);

        await expect(db.getRecipeById(id)).rejects.toThrow("can't get recipe by id");
    });
});

describe('recipe updating query', ()  => {
    test('updates all fields of a recipe', async () => {
        let recipe = exRecipes[0];
        const id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
        recipe = exRecipes[1];//note that the user matches

        await expect(db.updateRecipe(id, recipe.title, recipe.ingredients, recipe.content, recipe.portions, recipe.tags, true)).resolves.toBeTruthy();

        const data = await db.getRecipeById(id);
        checkDataWithRecipe(data, recipe, id, true);
        
        await db.deleteRecipe(id);
    });
});