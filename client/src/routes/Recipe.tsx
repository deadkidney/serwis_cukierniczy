import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, deleteRecipe } from "../utils/recipeQueries";
import { addLike, deleteLike, getLikesByRecipe } from "../utils/otherQueries";
import { useAuth } from "../authContext";

export default function Recipe() {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {user} = useAuth();
	
	let navigate = useNavigate();

	const {data, isLoading, isError} = useQuery({
		queryKey: ['recipes', {id: id}],
        queryFn: () => getRecipeById(id),
		retry: 1
	})
	
	const likes = useQuery({
		queryKey: ['likes', {recipe: id}],
		queryFn: () => getLikesByRecipe(id),
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

	const addLikeMutation = useMutation({
		mutationFn: addLike,
		onSuccess: () => {
			likes.refetch();
			alert('recipe liked successfully');
		},
		onError: () => alert('failed to like recipe :c ')
	});

	const deleteLikeMutation = useMutation({
		mutationFn: deleteLike,
		onSuccess: () => {
			likes.refetch();
			alert('recipe unliked successfully');
		},
		onError: () => alert('failed to unlike recipe :c ')
	});

    if (isLoading || likes.isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the recipe</p>);

	return (
		<div key={data[0].id}>
			{user && user.id != data[0].user_id && (
				likes.data.map((like) => like.user_id).includes(user.id) ? 
				<button onClick={() => deleteLikeMutation.mutate({recipe_id: id, user_id: user.id})}>unlike</button> :
				<button onClick={() => addLikeMutation.mutate({recipe_id: id, user_id: user.id})}>like</button>
				)}
			<h3>{data[0].title}</h3>
			<p>Likes: {likes.data.length}</p>
			<p>Author:</p>
			<Link to={`/user/${data[0].user_id}`}>{data[0].username}</Link>
			<p>{data[0].content}</p>
			{ user && user.id == data[0].user_id &&
				<Link to={`/edit/recipe/${id}`}>edit</Link>}
			{ user && user.id == data[0].user_id &&
				<button onClick={() => deleteRecipeMutation.mutate(id)}>delete</button>}
			<Link to={`/comments/recipe/${id}`}>Comments</Link>
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