import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useMutation } from "@tanstack/react-query";
import { addRecipe } from "../../utils/recipeQueries";
import type { RecipeData } from "../../DataInterfaces";
import RecipeForm from "../../components/inputs/RecipeForm";
import { Alert, Button, Stack, Typography } from "@mui/material";

export default function AddRecipeForm() {
	const navigate = useNavigate();
	const {user} = useAuth();

	if (!user)
		return (<Alert severity="info" color="secondary">
			You need to <Button component={RouterLink} to='/login'>Log in</Button> to add a recipe.
			</Alert>)
	
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
		},
		onError: () => alert('failed to add recipe')
	});

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(recipe.ingredients.length == 0)
			return alert('add at least one ingredient')
		addRecipeMutation.mutate({recipe: recipe, token: user.token});
	};

	return (
		<Stack
			spacing={2}
			sx={{ 
				alignItems: "center",
				padding: 3
			}}
		>
			<Typography variant="h3">
				Create new recipe
			</Typography>
			<Alert severity="info" color="secondary">
				After you add the recipe you'll have to wait for admin to accept it.
			</Alert>
			<RecipeForm recipe={recipe} setRecipe={setRecipe} handleSubmit={handleSubmit}/>
			<Stack direction='row'
				spacing={3}
				sx={{
					justifyContent: "space-evenly",
					alignItems: "center",
				}}
			>
				<Button type="submit" form="recipeForm" disabled={addRecipeMutation.isPending}>
					{addRecipeMutation.isPending ? "Adding Recipe..." : "Add Recipe"}
				</Button>
				<Button type="button" onClick={() => navigate(-1)}>
					Cancel
				</Button>
			</Stack>
		</Stack>
	);
};
