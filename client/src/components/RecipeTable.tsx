import type { RecipeData } from '../DataInterfaces';
import RecipePreviev from './RecipePreviev';

export default function RecipeTable({
    recipes
} : {
    recipes: RecipeData[]
}) {

    return (
        <div>
            {recipes.map((recipe) => {
                return(
                    <RecipePreviev key={recipe.id} data={recipe}/>
                );
            })}
        </div>
    );
};