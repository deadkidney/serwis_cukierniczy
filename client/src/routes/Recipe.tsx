import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getRecipeById, deleteRecipe } from "../utils/recipeQueries";
import { addLike, getLikesAmount } from "../utils/otherQueries";
import EditRecipeForm from "./EditRecipeForm";

export default function Recipe() {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");
	
	let navigate = useNavigate();
	const [editMode, setEditMode] = useState(false);

	const {data, isLoading, isError, refetch} = useQuery({
		queryKey: ['recipes', {id: id}],
        queryFn: () => getRecipeById(id),
		retry: 1
	})
	
	const likes = useQuery({
		queryKey: ['likes', {recipe: id}],
		queryFn: () => getLikesAmount(id),
		retry: 1
	})

	const deleteRecipeMutation = useMutation({
		mutationFn: deleteRecipe,
		onSuccess: () => {
			navigate(-1);
			alert('deleted successfully');
		},
		onError: () => alert('failed to delete')
	});

	const handleDelete = () => {
		deleteRecipeMutation.mutate(id);
	};

	const addLikeMutation = useMutation({
		mutationFn: addLike,
		onSuccess: () => {
			likes.refetch();
			alert('recipe liked successfully');
		},
		onError: () => alert('failed to add recipe :c ')
	});

	const handleLike = () => {
		addLikeMutation.mutate({recipe_id: id, user_id: '3'}); //placeholder user id
	};

    if (isLoading || likes.isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the recipe</p>);

	if (editMode)
		return (<EditRecipeForm currentRecipe={data[0]} setEditMode={setEditMode}/>)

	return (
		<div key={data[0].id}>
			<button onClick={handleLike}>like</button>
			<h3>{data[0].title}</h3>
			<p>Likes: {likes.data[0].count}</p>
			<p>Author:</p>
			<Link to={`/user/${data[0].user_id}`}>{data[0].username}</Link>
			<p>{data[0].content}</p>
			<button onClick={() => setEditMode(true)}>edit</button>
			<button onClick={handleDelete}>delete</button>
			<Link to={`/comments/recipe/${data[0].id}`}>Comments</Link>
		</div>
	);
};

/*
<ul>
					{recipe.ingredients.map((ingredient) => {
					return(
						<li key={ingredient.id}>
							{ingredient.name}: {ingredient.amount} {ingredient.unit}
						</li>
					);
				})}
				</ul>
*/