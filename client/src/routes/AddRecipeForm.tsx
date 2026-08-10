import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { useMutation } from "@tanstack/react-query";
import { addRecipe } from "../utils/recipeQueries";

export default function AddRecipeForm() {
	let navigate = useNavigate();
	const {user} = useAuth();

	if (!user)
		return <Link to='/login'>Log in to add recipe</Link>

	
	const [recipe, setRecipe] = useState({
		id: "",
		title: "",
		user_id: user.id,
		content: "",
		portions: 1,
		accepted: false
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
		addRecipeMutation.mutate({recipe: recipe, token: user.token});
	};

	return (
		<div>
			<h2>Add new recipe</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="title">title:</label>
				<input type="text" value={recipe.title} id="title" name="title" onChange={onChangeHandler} required/>
				<label htmlFor="content">content:</label>
				<textarea value={recipe.content} id="content" name="content" onChange={onChangeHandler} rows={10} cols={50} required/>
				<label htmlFor="portions">portions:</label>
				<input type="number" value={recipe.portions} id="portions" name="portions" onChange={onChangeHandler} required/>
				<button type="submit" disabled={addRecipeMutation.isPending}>
					{addRecipeMutation.isPending ? "Adding Recipe..." : "Add Recipe"}
				</button>
			</form>
		</div>
	);
};
