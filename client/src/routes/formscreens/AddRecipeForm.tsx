import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { useMutation } from "@tanstack/react-query";
import { addRecipe } from "../../utils/recipeQueries";
import type { RecipeData } from "../../DataInterfaces";
import RecipeForm from "../../components/inputs/RecipeForm";
import { Button, Card, Typography } from "@mui/material";

export default function AddRecipeForm() {
	let navigate = useNavigate();
	const {user} = useAuth();

	if (!user)
		return <Link to='/login'>Log in to add recipe</Link>
	
	const [recipe, setRecipe] = useState<RecipeData>({
		id: "",
		title: "",
		user_id: user.id,
		ingredients: [],
		content: "",
		portions: 1,
		tags: [],
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

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(recipe.ingredients.length == 0)
			return alert('add at least one ingredient')
		addRecipeMutation.mutate({recipe: recipe, token: user.token});
	};

	return (
		<Card variant="outlined" sx={{ maxWidth: 600 }}>
			<Typography variant="h3">
				Create new recipe
			</Typography>
			<Typography variant="subtitle1">
				After you add the recipe you'll have to wait for admin to accept it.
			</Typography>
			<RecipeForm recipe={recipe} setRecipe={setRecipe} handleSubmit={handleSubmit}/>
			<Button type="submit" form="recipeForm" disabled={addRecipeMutation.isPending}>
				{addRecipeMutation.isPending ? "Adding Recipe..." : "Add Recipe"}
			</Button>
		</Card>
	);
};
