import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteRecipe } from "../utils/recipeQueries";
import type { RecipeData } from "../DataInterfaces";

export default function RecipePreviev({
    data
} : {
    data: RecipeData
    }) {
	
	const deleteRecipeMutation = useMutation({
		mutationFn: deleteRecipe,
		onSuccess: () => alert('deleted successfully'),
		onError: () => alert('failed to delete')
	});

	const handleDelete = () => {
		deleteRecipeMutation.mutate(data.id);
	};

    return (
        <div>
            <Link to={`/recipe/${data.id}`}>
                <h3>{data.title}</h3>
            </Link>
            <p>Author: {data.user_id}</p>
            <button onClick={handleDelete}>delete</button>
        </div>
        
    );
};