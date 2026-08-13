import { Link } from "react-router-dom";
import type { RecipeShort } from '../DataInterfaces';
import Tags from "./Tags";

export default function RecipeTable({
    recipes
} : {
    recipes: RecipeShort[]
}) {

    if (recipes.length == 0)
        return (<p>Nothing here...</p>);

    return (
        <div>
            {recipes.map((recipe) => {
                return(
                    <div key={recipe.id}>
                        <Link to={`/recipe/${recipe.id}`}>
                            <h3>{recipe.title}</h3>
                        </Link>
                        <Tags tags={recipe.tags}/>
                    </div> 
                );
            })}
        </div>
    );
};