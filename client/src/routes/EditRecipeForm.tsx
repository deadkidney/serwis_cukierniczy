import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
	let navigate = useNavigate();

	const [recipe, setRecipe] = useState({
		id: currentRecipe.id || "",
		title: currentRecipe.title || "",
		user_id: currentRecipe.user_id || "",
		content: currentRecipe.content || ""
	});

	const updateRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			setEditMode(false);
			navigate(`/recipe/${currentRecipe.id}`);
			alert('recipe updated successfully');
		},
		onError: () => alert('failed to update recipe :c ')
	});

	const onChangeHandler = (e) => {
		setRecipe(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		updateRecipeMutation.mutate(recipe);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<p>title:</p>
				<input type="text" value={recipe.title} name="title" onChange={onChangeHandler} />
				<p>content:</p>
				<input type="text" value={recipe.content} name="content" onChange={onChangeHandler} />
			<button type="submit" disabled={updateRecipeMutation.isPending}>
				{updateRecipeMutation.isPending ? "Updating Recipe..." : "Update Recipe"}
			</button>
			</form>
		</div>
	);
};
