import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, deleteRecipe, updateRecipe } from "../utils/recipeQueries";
import { getRatingAverage } from "../utils/otherQueries";
import { useAuth } from "../authContext";
import LikeAndRatingButtons from "../components/LikeAndRatingButtons";
import Tags from "../components/Tags";
import Ingredients from "../components/Ingredients";
import { Button, Container, Rating, Stack, Typography } from "@mui/material";

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
			<Container maxWidth="md">
				{user && user.id != data.user_id && <LikeAndRatingButtons recipe_id={id} user={user}/>}
				<h3>{data.title}</h3>
				<Stack direction='row' spacing={{sm: 1, md: 2}}>
					<Button component={RouterLink} to={`/user/${data.user_id}`}>{data.username}</Button>
					<Typography variant='button'>Portions: {data.portions}</Typography>
					<Rating name="read-only" value={ratingavg.data ? ratingavg.data : 0} readOnly max={10} precision={0.1} />
				</Stack>
				<Tags tags={data.tags}/>
				<Ingredients ingredients={data.ingredients}/>
				<p style={{whiteSpace: 'pre-wrap'}}>{data.content}</p>
				{ user && user.id == data.user_id &&
					<Button component={RouterLink} to={`/edit/recipe/${id}`}>edit</Button>}
				{ user && (user.id == data.user_id || user.role == 'ADMIN') &&
					<Button onClick={() => deleteRecipeMutation.mutate({id: id, token: user.token})}>delete</Button>}
				{ !data.accepted && user && user.role == 'ADMIN' &&
					<Button onClick={() => acceptRecipeMutation.mutate({recipe: {...data, accepted: true}, token: user.token})}>accept recipe</Button>}
				<Button component={RouterLink} to={`/comments/recipe/${id}`}>Comments</Button>
			</Container>
		);
	else return (<p>You can't view this recipe</p>);
};