import { useQuery, useMutation } from "@tanstack/react-query";
import { addFavourite, addRating, deleteFavourite, deleteRating, getIsFavourite, getRating } from "../utils/otherQueries";
import type { UserData } from "../DataInterfaces";
import LoadingScreen from "./LoadingScreen";
import { Alert, Button, IconButton, Rating, Stack } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


export default function FavouriteAndRatingButtons({
	user, recipe_id, ratingAvgRefetch
} : {
	user : UserData, recipe_id : string, ratingAvgRefetch: any
}) {

	const isFavourite = useQuery({
		queryKey: ['favourite', {recipe: recipe_id}],
		queryFn: () => getIsFavourite({user_id: user.id, recipe_id, token: user.token}),
		retry: 1
	})

    const myRating = useQuery({
		queryKey: ['rating', {recipe: recipe_id}],
		queryFn: () => getRating({user_id: user.id, recipe_id, token: user.token}),
		retry: 1
	})

	const addFavouriteMutation = useMutation({
		mutationFn: addFavourite,
		onSuccess: () => {
			isFavourite.refetch();
		},
		onError: () => alert('failed to favourite recipe')
	});

	const deleteFavouriteMutation = useMutation({
		mutationFn: deleteFavourite,
		onSuccess: () => {
			isFavourite.refetch();
		},
		onError: () => alert('failed to unfavourite recipe')
	});
	
	const addRatingMutation = useMutation({
		mutationFn: addRating,
		onSuccess: () => {
			myRating.refetch();
			ratingAvgRefetch();
		},
		onError: () => alert('failed to rate recipe')
	});

	const deleteRatingMutation = useMutation({
		mutationFn: deleteRating,
		onSuccess: () => {
            myRating.refetch();
			ratingAvgRefetch();
		},
		onError: () => alert('failed to delete rating')
	});

    if (isFavourite.isPending || myRating.isPending)
        return (<LoadingScreen/>);

    if (isFavourite.isError || myRating.isError)
        return (<Alert severity='error'>Something went wrong </Alert>);

		return (
			<Stack
					direction='row'
					spacing={1}
					sx={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
				{ isFavourite.data != 0 ? 
					<IconButton onClick={() => deleteFavouriteMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})} color="secondary">
						<FavoriteIcon/>
					</IconButton> :
					<IconButton onClick={() => addFavouriteMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})} color="secondary">
						<FavoriteBorderIcon/>
					</IconButton>
				}
				<Rating name="rate recipe" 
					value={myRating.data}
					onChange={(e, newvalue) => {
						if(newvalue != null) {
							deleteRatingMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})
							addRatingMutation.mutate({data: {recipe_id, user_id: user.id, value: newvalue}, token: user.token})
						}
					}}
				/>
                
                { myRating.data != 0 &&
					<Button onClick={() => deleteRatingMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})}>delete my rating</Button>
				}
			</Stack>
		);
};