import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, updateRecipe } from "../../utils/recipeQueries";
import { useAuth } from "../../contexts/authContext";
import type { RecipeData } from "../../DataInterfaces";
import RecipeForm from "../../components/inputs/RecipeForm";
import LoadingScreen from "../../components/LoadingScreen";
import { Alert, Button, Stack, Typography } from "@mui/material";

export default function EditRecipeForm () {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {user} = useAuth();

	const navigate = useNavigate();

	const {data, isPending, isError} = useQuery({
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
	
	if (isPending)
        return (<LoadingScreen/>);

	if (isError)
        return (<Alert severity="error">Couldn't find the recipe</Alert>);

	if (!user || user.id != data.user_id)
		return (<Alert severity="info" color="secondary">You can't edit this recipe</Alert>);
	
	const updateRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			navigate(`/recipe/${id}`);
		},
		onError: () => alert('failed to update recipe')
	});

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateRecipeMutation.mutate({recipe: recipe, token: user.token});
	};

	return (
		<Stack
			spacing={2}
			sx={{ 
				alignItems: "center",
				padding: 3
			}}
		>	
			<Typography variant="h3" align="center">
				Edit recipe
			</Typography>
			<Alert severity="info" color="secondary">
				After you edit the recipe you'll have to wait for admin to accept it again.
			</Alert>
			<RecipeForm recipe={recipe} setRecipe={setRecipe} handleSubmit={handleSubmit}/>
			<Stack direction='row'
				spacing={3}
				sx={{
					justifyContent: "space-evenly",
					alignItems: "center",
				}}
			>
				<Button type="submit" form="recipeForm" disabled={updateRecipeMutation.isPending}>
					{updateRecipeMutation.isPending ? "Updating Recipe..." : "Update Recipe"}
				</Button>
				<Button type="button" onClick={() => navigate(`/recipe/${id}`)}>
					Cancel
				</Button>
			</Stack>
		</Stack>
	);
};
