import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, deleteRecipe, updateRecipe } from "../utils/recipeQueries";
import { getRatingAverage } from "../utils/otherQueries";
import { useAuth } from "../contexts/authContext";
import { useMixRecipes } from "../contexts/mixRecipesContext";
import FavouriteAndRatingButtons from "../components/FavouriteAndRatingButtons";
import Tags from "../components/Tags";
import Ingredients from "../components/Ingredients";
import LoadingScreen from "../components/LoadingScreen";
import { Alert, Button, Divider, Rating, Stack, Typography } from "@mui/material";

export default function Recipe() {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {user} = useAuth();
	const {recipesToMix, addRecipeToMix} = useMixRecipes();

	const navigate = useNavigate();

	const {data, isPending, isError, refetch} = useQuery({
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
		},
		onError: () => alert('failed to delete')
	});

	const acceptRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			refetch();
		},
		onError: () => alert('failed to update recipe')
	});

    if (isPending || ratingavg.isPending)
        return (<LoadingScreen/>);

    if (isError)
        return (<Alert severity="error">Couldn't find the recipe</Alert>);

	if(data.accepted || (user && (user.role == 'ADMIN' || user.id == data.user_id)))
		return (
			<Stack 
				spacing={1}
				sx={{
						justifyContent: "center",
						alignItems: "center",
						padding: 2
					}}
			>
				{data.accepted && user && !recipesToMix.includes(id) &&
					<Button onClick={() => addRecipeToMix(id)}> Add to Mix recipes</Button>
				}
				{data.accepted && user && user.id != data.user_id && <FavouriteAndRatingButtons recipe_id={id} user={user} ratingAvgRefetch={ratingavg.refetch}/>}
				<Typography variant="h4">{data.title}</Typography>
				{!data.accepted && <Typography variant='button' color="secondary">not accepted</Typography>}
				<Stack
					direction={{sm: 'column', md: 'row'}} 
					spacing={{sm: 2, md: 4}}
					sx={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Button component={RouterLink} to={`/user/${data.user_id}`}>{data.username}</Button>
					<Typography variant='button'>Portions: {data.portions}</Typography>
					<Rating name="read-only" value={ratingavg.data ? ratingavg.data : 0} readOnly precision={0.1} />
				</Stack>
				<Tags tags={data.tags}/>
				<Stack
					direction={{sm: 'column', md: 'row'}}
					spacing={{sm: 2, md: 4}}
					divider={<Divider orientation="vertical" flexItem />}
					sx={{
						justifyContent: "space-evenly",
						alignItems: "flex-start",
					}}
				>
					<Ingredients ingredients={data.ingredients} portions={data.portions}/>
					<Typography sx={{whiteSpace: 'pre-wrap'}}>{data.content}</Typography>
				</Stack>
				<Stack direction='row'>
					{user && user.id == data.user_id &&
						<Button component={RouterLink} to={`/edit/recipe/${id}`}>edit</Button>}
					{user && (user.id == data.user_id || user.role == 'ADMIN') &&
						<Button onClick={() => deleteRecipeMutation.mutate({id: id, token: user.token})}>delete</Button>}
					{!data.accepted && user && user.role == 'ADMIN' &&
						<Button onClick={() => acceptRecipeMutation.mutate({recipe: {...data, accepted: true}, token: user.token})}>accept recipe</Button>}
					<Button component={RouterLink} to={`/comments/recipe/${id}`}>Comments</Button>
				</Stack>
			</Stack>
		);
	else return (<Alert severity="info" color="secondary">You can't view this recipe</Alert>);
};