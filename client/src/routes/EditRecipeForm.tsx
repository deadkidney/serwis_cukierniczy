import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, updateRecipe } from "../utils/recipeQueries";
import { useAuth } from "../authContext";

export default function EditRecipeForm () {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {user} = useAuth();

	let navigate = useNavigate();

	const {data, isLoading, isError} = useQuery({
		queryKey: ['recipes', {id: id}],
        queryFn: () => getRecipeById(id),
		retry: 1
	})

	if (isLoading)
        return (<p>Loading...</p>);

	if (isError)
        return (<p>Couldn't find the recipe</p>);

	if (!user || user.id != data[0].user_id) {
		return (<p>You can't edit this recipe</p>);
	}

	const [recipe, setRecipe] = useState({
		id: data[0].id,
		title: data[0].title,
		user_id: data[0].user_id,
		content: data[0].content
	});

	const updateRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			navigate(`/recipe/${id}`);
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
		updateRecipeMutation.mutate({recipe: recipe, token: user.token});
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
