import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addRecipe } from "../utils/recipeQueries";

export default function AddRecipeForm() {
	const [recipe, setRecipe] = useState({
		id: "",
		title: "",
		user_id: 0,
		content: ""
	});

	const addRecipeMutation = useMutation({
		mutationFn: addRecipe,
		onSuccess: () => alert('recipe added successfully'),
		onError: () => alert('failed to add recipe :c ')
	});

	const onChangeHandler = (e) => {
		setRecipe(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const handleSubmit = () => {
		addRecipeMutation.mutate(recipe);
	};

	return (
		<div>
			<form>
				<p>title:</p>
				<input type="text" value={recipe.title} name="title" onChange={onChangeHandler} />
				<p>author:</p>
				<input type="number" value={recipe.user_id} name="user_id" onChange={onChangeHandler} />
			</form>
			<button onClick={handleSubmit} disabled={addRecipeMutation.isPending}>
				{addRecipeMutation.isPending ? "Adding Recipe..." : "Add Recipe"}
			</button>
		</div>
	);
};
