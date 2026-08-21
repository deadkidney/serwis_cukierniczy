// test recipe database query functions
// assumes the database is not live (that nothing else uses the database) throughout the testing
// assumes there are at least three users in the database (id 1, 2 and 3) and there is no user with id = 9999999 in the database
// assumes no recipe in the database contains "testRecipe" in it's name


import * as db from '../repository.js';


const exRecipes = [
    {title: "testRecipe1", user_id: 1, ingredients: '[{"id":1,"name":"ing1","amount":1,"unit":"i"}]', content: "lorem ipsum", portions: 1, tags: []}, 
    {title: "testRecipe2", user_id: 1, ingredients: '[{"id":1,"name":"ing1","amount":1,"unit":"i"},{"id":2,"name":"ing2","amount":"5.4","unit": "l"}]', content: "lorem ipsum dolor sit amet", portions: 2, tags: ["vegan", "vegetarian"]}, 
    {title: "testRecipe21", user_id: 3, ingredients: '[{"id": 1,"name":"ing1","amount":1,"unit":"i"},{"id":2,"name":"ing2","amount":"2","unit":"ml"}]', content: "aaa", portions: 10, tags: ["cake", "vegetarian"]}
];


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

describe('listing and counting recipes queries', ()  => {
    test('list and count all recipes', async () => {
        const search = '';
        const tags = [];
        let n = parseInt(await db.getFilteredRecipesAmount(search, tags));
        let recipes=[];
        for (const recipe of exRecipes){
            var id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
            await db.updateRecipe(id, recipe.title, recipe.ingredients, recipe.content, recipe.portions, recipe.tags, true);
            recipes.push({id: id, title: recipe.title, tags: recipe.tags});
        }
        await expect(db.getFilteredRecipesAmount(search, tags)).resolves.toEqual(String(n + exRecipes.length));

        let data = await db.getFilteredRecipes(search, tags, 0, exRecipes.length);
        recipes.forEach((recipe) => {expect(data).toContainEqual(recipe)});

        const lastrecipe=recipes.pop();
        await db.deleteRecipe(lastrecipe.id);

        await expect(db.getFilteredRecipesAmount(search, tags)).resolves.toEqual(String(n + exRecipes.length - 1));

        data = await db.getFilteredRecipes(search, tags, 0, exRecipes.length);
        recipes.forEach((recipe) => {expect(data).toContainEqual(recipe)});
        expect(data).not.toContainEqual(lastrecipe);

        for (const recipe of recipes){
            await db.deleteRecipe(recipe.id);
        }
    });

    test('list and count recipes filtered by name', async () => {
        const search = "testRecipe";
        const search2 = "testRecipe2";
        const tags = [];
        let n = parseInt(await db.getFilteredRecipesAmount(search, tags));
        let n2 = parseInt(await db.getFilteredRecipesAmount(search2, tags));
        let recipes=[];
        for (const recipe of exRecipes){
            var id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
            await db.updateRecipe(id, recipe.title, recipe.ingredients, recipe.content, recipe.portions, recipe.tags, true);
            recipes.push({id: id, title: recipe.title, tags: recipe.tags});
        }
        await expect(db.getFilteredRecipesAmount(search, tags)).resolves.toEqual(String(n + exRecipes.length));
        await expect(db.getFilteredRecipesAmount(search2, tags)).resolves.toEqual(String(n2 + 2));
        
        let data = await db.getFilteredRecipes(search, tags, 0, exRecipes.length);
        recipes.forEach((recipe) => {expect(data).toContainEqual(recipe)});

        data = await db.getFilteredRecipes(search2, tags, 0, exRecipes.length);
        expect(data).toContainEqual(recipes[1]);
        expect(data).toContainEqual(recipes[2]);
        expect(data).not.toContainEqual(recipes[0]);

        const lastrecipe=recipes.pop();
        await db.deleteRecipe(lastrecipe.id);

        await expect(db.getFilteredRecipesAmount(search, tags)).resolves.toEqual(String(n + exRecipes.length - 1));

        data = await db.getFilteredRecipes(search, tags, 0, exRecipes.length);
        recipes.forEach((recipe) => {expect(data).toContainEqual(recipe)});
        expect(data).not.toContainEqual(lastrecipe);

        await expect(db.getFilteredRecipesAmount(search2, tags)).resolves.toEqual(String(n2 + 1));

        for (const recipe of recipes){
            await db.deleteRecipe(recipe.id);
        }
    });

    test('list and count recipes filtered by tags', async () => {
        const search = '';
        const tags = ["cake", "vegetarian"];
        const tags2 = ["vegetarian"];
        let n = parseInt(await db.getFilteredRecipesAmount(search, tags));
        let n2 = parseInt(await db.getFilteredRecipesAmount(search, tags2));
        let recipes=[];
        for (const recipe of exRecipes){
            var id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
            await db.updateRecipe(id, recipe.title, recipe.ingredients, recipe.content, recipe.portions, recipe.tags, true);
            recipes.push({id: id, title: recipe.title, tags: recipe.tags});
        }
        await expect(db.getFilteredRecipesAmount(search, tags)).resolves.toEqual(String(n + 1));
        await expect(db.getFilteredRecipesAmount(search, tags2)).resolves.toEqual(String(n2 + 2));

        let data = await db.getFilteredRecipes(search, tags, 0, exRecipes.length);
        expect(data).toContainEqual(recipes[2]);
        expect(data).not.toContainEqual(recipes[0]);
        expect(data).not.toContainEqual(recipes[1]);
        
        data = await db.getFilteredRecipes(search, tags2, 0, exRecipes.length);
        expect(data).toContainEqual(recipes[1]);
        expect(data).toContainEqual(recipes[2]);
        expect(data).not.toContainEqual(recipes[0]);

        for (const recipe of recipes){
            await db.deleteRecipe(recipe.id);
        }
    });
    
    test('split data into pages', async () => {
        const search = '';
        const tags = [];
        let recipes=[];
        for (const recipe of exRecipes){
            var id = await db.createRecipe(recipe.title, recipe.user_id, recipe.ingredients, recipe.content, recipe.portions, recipe.tags);
            await db.updateRecipe(id, recipe.title, recipe.ingredients, recipe.content, recipe.portions, recipe.tags, true);
            recipes.push({id: id, title: recipe.title, tags: recipe.tags});
        }
        let data = await db.getFilteredRecipes(search, tags, 0, 2);
        expect(data.length).toEqual(2);
        expect(data).toContainEqual(recipes[2]);
        expect(data).toContainEqual(recipes[1]);
        expect(data).not.toContainEqual(recipes[0]);
        
        data = await db.getFilteredRecipes(search, tags, 1, 2);
        expect(data.length).toBeLessThanOrEqual(2);
        expect(data).toContainEqual(recipes[0]);
        expect(data).not.toContainEqual(recipes[1]);
        expect(data).not.toContainEqual(recipes[2]);

        for (const recipe of recipes){
            await db.deleteRecipe(recipe.id);
        }
    });
});