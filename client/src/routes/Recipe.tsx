import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, deleteRecipe, updateRecipe } from "../utils/recipeQueries";
import { getRatingAverage } from "../utils/otherQueries";
import { useAuth } from "../authContext";
import LikeAndRatingButtons from "../components/LikeAndRatingButtons";

export default function Recipe() {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {user} = useAuth();
	
	let navigate = useNavigate();

	const {data, isLoading, isError, refetch} = useQuery({
		queryKey: ['recipe', {id: id}],
        queryFn: () => getRecipeById(id),
		retry: 1
	})

	const ratingavg = useQuery({
		queryKey: ['ratingsavg', {recipe: id}],
		queryFn: () => getRatingAverage(id),
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

	const acceptRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			refetch();
			alert('recipe updated successfully');
		},
		onError: () => alert('failed to update recipe :c ')
	});

    if (isLoading || ratingavg.isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the recipe</p>);

	if(data.accepted || (user && (user.role == 'ADMIN' || user.id == data.user_id)))
		return (
			<div key={data.id}>
				{user && user.id != data.user_id && <LikeAndRatingButtons recipe_id={id} user={user}/>}
				<h3>{data.title}</h3>
				<p>Rating Average: {ratingavg.data ? ratingavg.data : "This recipe hasn't been rated yet"}</p>
				<p>Portions: {data.portions}</p>
				<p>Author:</p>
				<Link to={`/user/${data.user_id}`}>{data.username}</Link>
				<p style={{whiteSpace: 'pre-wrap'}}>{data.content}</p>
				{ user && user.id == data.user_id &&
					<Link to={`/edit/recipe/${id}`}>edit</Link>}
				{ user && user.id == data.user_id &&
					<button onClick={() => deleteRecipeMutation.mutate({id: id, token: user.token})}>delete</button>}
				{ !data.accepted && user && user.role == 'ADMIN' &&
					<button onClick={() => acceptRecipeMutation.mutate({recipe: {...data, accepted: true}, token: user.token})}>accept recipe</button>}
				<Link to={`/comments/recipe/${id}`}>Comments</Link>
			</div>
		);
	else return (<p>You can't view this recipe</p>);
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