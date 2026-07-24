import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../utils/userQueries";
import { getLikedRecipes, getRecipesByAuthor } from "../utils/recipeQueries";
import RecipeTable from "../components/RecipeTable";

export default function User() {
	const {id} = useParams();
	if (!id) throw Error("no user id");

	const user = useQuery({
		queryKey: ['user', {id: id}],
        queryFn: () => getUserById(id),
		retry: 1
	})

	const authored = useQuery({
		queryKey: ['authored', {author: id}],
		queryFn: () => getRecipesByAuthor(id),
		retry: 1
	});

	const liked = useQuery({
		queryKey: ['liked', {user: id}],
		queryFn: () => getLikedRecipes(id),
		retry: 1
	});
	

	if (user.isLoading || authored.isLoading || liked.isLoading) 
        return (<p>Loading...</p>);

    if (user.isError) 
        return (<p>Couldn't find the user</p>);

	if (authored.isError || liked.isError) 
        return (<p>Couldn't find the recipes</p>);


	return (
		<div>
			<div key={user.data[0].id}>
				<h3>{user.data[0].username}</h3>
			</div>
			{authored.isSuccess && 
				<section>
					<p>My recipes:</p>
					<RecipeTable recipes={authored.data}/>
				</section>
			}
			{liked.isSuccess && 
				<section>
					<p>Liked recipes:</p>
					<RecipeTable recipes={liked.data}/>
				</section>
			}
		</div>
	);
};