import { useQuery, useMutation } from "@tanstack/react-query";
import { addLike, addRating, deleteLike, deleteRating, getIsLiked, getRating } from "../utils/otherQueries";
import type { UserData } from "../DataInterfaces";
import { useState } from "react";

export default function LikeAndRatingButtons({user, recipe_id} : {user : UserData, recipe_id : string}) {

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

    const [value, setValue] = useState('10');

	const addLikeMutation = useMutation({
		mutationFn: addLike,
		onSuccess: () => {
			isLiked.refetch();
			alert('recipe liked successfully');
		},
		onError: () => alert('failed to like recipe :c ')
	});

	const deleteLikeMutation = useMutation({
		mutationFn: deleteLike,
		onSuccess: () => {
			isLiked.refetch();
			alert('recipe unliked successfully');
		},
		onError: () => alert('failed to unlike recipe :c ')
	});
	
	const addRatingMutation = useMutation({
		mutationFn: addRating,
		onSuccess: () => {
			myRating.refetch();
			alert('recipe rated successfully');
		},
		onError: () => alert('failed to rate recipe :c ')
	});

	const deleteRatingMutation = useMutation({
		mutationFn: deleteRating,
		onSuccess: () => {
            myRating.refetch();
			alert('rating deleted successfully');
		},
		onError: () => alert('failed to delete rating :c ')
	});

    const handleSubmit = () => {
        const intvalue = parseInt(value)
        if(isNaN(intvalue) || intvalue <= 0 || intvalue > 10) {
            setValue('10')
            return alert('incorrect rating')
        }
		addRatingMutation.mutate({data: {recipe_id, user_id: user.id, value: intvalue}, token: user.token})
    }

    if (isLiked.isLoading || myRating.isLoading)
        return (<p>Loading...</p>);

    if (isLiked.isError || myRating.isError)
        return (<p>Couldn't find the </p>);

		return (
			<div>
				{ isLiked.data != 0 ? 
					<button onClick={() => deleteLikeMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})}>unlike</button> :
					<button onClick={() => addLikeMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})}>like</button>
				}
                { myRating.data != 0? 
					<p>My rating: {myRating.data}</p>:
					<input type="number" value={value} onChange={(e) => setValue(e.target.value)}/>
				}
                { myRating.data != 0 ? 
					<button onClick={() => deleteRatingMutation.mutate({data: {recipe_id, user_id: user.id}, token: user.token})}>delete my rating</button> :
					<button onClick={handleSubmit}>add rating</button>
				}
			</div>
		);
};