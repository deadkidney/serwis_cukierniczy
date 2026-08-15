import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, updateRecipe } from "../../utils/recipeQueries";
import { useAuth } from "../../authContext";
import type { RecipeData } from "../../DataInterfaces";
import RecipeForm from "../../components/inputs/RecipeForm";
import { Button, Card, Typography } from "@mui/material";

export default function EditRecipeForm () {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {user} = useAuth();

	let navigate = useNavigate();

	const {data, isLoading, isError} = useQuery({
		queryKey: ['recipe', {id: id}],
        queryFn: () => getRecipeById(id),
		retry: 1
	})
	
	const [recipe, setRecipe] = useState<RecipeData>({
			id: data ? data.id : "",
			title: (data && data.title) ? data.title : "",
			user_id: (data && data.user_id) ? data.user_id : "",
			ingredients: (data && data.ingredients) ? data.ingredients : [],
			content: (data && data.content) ? data.content : "",
			portions: (data && data.portions) ? data.portions : 1,
			tags: (data && data.tags) ? data.tags : [],
			accepted: false
	});
	
	if (isLoading)
        return (<p>Loading...</p>);

	if (isError)
        return (<p>Couldn't find the recipe</p>);

	if (!user || user.id != data.user_id)
		return (<p>You can't edit this recipe</p>);
	
	const updateRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			navigate(`/recipe/${id}`);
			alert('recipe updated successfully');
		},
		onError: () => alert('failed to update recipe :c ')
	});

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateRecipeMutation.mutate({recipe: recipe, token: user.token});
	};

	return (
		<Card variant="outlined" sx={{ maxWidth: 600 }}>
			<Typography variant="h3">
				Edit recipe
			</Typography>
			<Typography variant="subtitle1">
				After you edit the recipe you'll have to wait for admin to accept it again.
			</Typography>
			<RecipeForm recipe={recipe} setRecipe={setRecipe} handleSubmit={handleSubmit}/>
			<Button type="submit" form="recipeForm" disabled={updateRecipeMutation.isPending}>
				{updateRecipeMutation.isPending ? "Updating Recipe..." : "Update Recipe"}
			</Button>
		</Card>
	);
};
