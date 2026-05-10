import { Link } from "react-router-dom";
import type { RecipeData } from "../DataInterfaces";

export default function RecipePreviev({
    data
} : {
    data: RecipeData
    }) {

    return (
        <Link to={`/recipe/${data.id}`}>
            <h3>{data.title}</h3>
        </Link>
    );
};