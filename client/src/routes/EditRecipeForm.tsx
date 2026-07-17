import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateRecipe } from "../utils/recipeQueries";
import type { RecipeData } from "../DataInterfaces";

export default function EditRecipeForm ({
    currentRecipe,
	setEditMode
} : {
    currentRecipe: RecipeData,
	setEditMode : React.Dispatch<React.SetStateAction<boolean>>
}) {
	const [recipe, setRecipe] = useState({
		id: currentRecipe.id,
		title: currentRecipe.title,
		user_id: currentRecipe.user_id,
		content: currentRecipe.content
	});
	console.log(currentRecipe);

	const updateRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			alert('recipe updated successfully');
			setEditMode(false);
		},
		onError: () => alert('failed to update recipe :c ')
	});

	const onChangeHandler = (e) => {
		setRecipe(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const handleSubmit = () => {
		updateRecipeMutation.mutate(recipe);
	};

	return (
		<div>
			<form>
				<p>title:</p>
				<input type="text" value={recipe.title} name="title" onChange={onChangeHandler} />
				<p>content:</p>
				<input type="text" value={recipe.content} name="content" onChange={onChangeHandler} />
			</form>
			<button onClick={handleSubmit} disabled={updateRecipeMutation.isPending}>
				{updateRecipeMutation.isPending ? "Updating Recipe..." : "Update Recipe"}
			</button>
		</div>
	);
};
