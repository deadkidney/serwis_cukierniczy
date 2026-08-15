import { useQuery, useMutation } from "@tanstack/react-query";
import { addLike, addRating, deleteLike, deleteRating, getIsLiked, getRating } from "../utils/otherQueries";
import type { UserData } from "../DataInterfaces";
import { Button, IconButton, Rating } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function LikeAndRatingButtons({
	user, recipe_id
} : {
	user : UserData, recipe_id : string
}) {

	const isLiked = useQuery({
		queryKey: ['liked', {recipe: recipe_id}],
		queryFn: () => getIsLiked({user_id: user.id, recipe_id, token: user.token}),
		retry: 1
	})

    const myRating = useQuery({
		queryKey: ['rating', {recipe: recipe_id}],
		queryFn: () => getRating({user_id: user.id, recipe_id, token: user.token}),
		retry: 1
	})

	const addLikeMutation = useMutation({
		mutationFn: addLike,
		onSuccess: () => {
			isLiked.refetch();
		},
		onError: () => alert('failed to like recipe :c ')
	});

	const deleteLikeMutation = useMutation({
		mutationFn: deleteLike,
		onSuccess: () => {
			isLiked.refetch();
		},
		onError: () => alert('failed to unlike recipe :c ')
	});
	
	const addRatingMutation = useMutation({
		mutationFn: addRating,
		onSuccess: () => {
			myRating.refetch();
		},
		onError: () => alert('failed to rate recipe :c ')
	});

	const deleteRatingMutation = useMutation({
		mutationFn: deleteRating,
		onSuccess: () => {
            myRating.refetch();
		},
		onError: () => alert('failed to delete rating :c ')
	});

    if (isLiked.isLoading || myRating.isLoading)
        return (<p>Loading...</p>);

    if (isLiked.isError || myRating.isError)
        return (<p>Something went wrong </p>);

		return (
			<div>
				{ isLiked.data != 0 ? 
					<IconButton onClick={() => deleteLikeMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})} color="secondary">
						<FavoriteIcon/>
					</IconButton> :
					<IconButton onClick={() => addLikeMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})} color="secondary">
						<FavoriteBorderIcon/>
					</IconButton>
				}
				<Rating name="rate recipe" 
					value={myRating.data} 
					max={10} 
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
			</div>
		);
};