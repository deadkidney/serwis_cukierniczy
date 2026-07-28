import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addRecipe } from "../utils/recipeQueries";

export default function AddRecipeForm() {
	let navigate = useNavigate();
	
	const [recipe, setRecipe] = useState({
		id: "",
		title: "",
		user_id: "",
		content: ""
	});

	const addRecipeMutation = useMutation({
		mutationFn: addRecipe,
		onSuccess: ({id}) => {
			navigate(`/recipe/${id}`);
			alert('recipe added successfully');
		},
		onError: () => alert('failed to add recipe :c ')
	});

	const onChangeHandler = (e) => {
		setRecipe(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		addRecipeMutation.mutate(recipe);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<p>title:</p>
				<input type="text" value={recipe.title} name="title" onChange={onChangeHandler} required/>
				<p>author:</p>
				<input type="number" value={recipe.user_id} name="user_id" onChange={onChangeHandler} required/>
				<p>content:</p>
				<input type="text" value={recipe.content} name="content" onChange={onChangeHandler} required/>
			<button type="submit" disabled={addRecipeMutation.isPending}>
				{addRecipeMutation.isPending ? "Adding Recipe..." : "Add Recipe"}
			</button>
			</form>
		</div>
	);
};
