import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../utils/userQueries";
import { getRecipesByAuthor } from "../utils/recipeQueries";
import RecipeTable from "../components/RecipeTable";

export default function User() {
	const {id} = useParams();
	if (!id) throw Error("no user id");

	const {data, isLoading, isError} = useQuery({
		queryKey: ['user', {id: id}],
        queryFn: () => getUserById(id),
		retry: 1
	})

	/*const recipes = useQuery({
		queryKey: ['recipes', {author: id }],
		queryFn: () => getRecipesByAuthor(id),
		retry: 1
	});*/
	

	if (isLoading) 
        return (<p>Loading...</p>);

    if (isError) 
        return (<p>Couldn't find the user</p>);


	return (
		<div>
			<div key={data[0].id}>
				<h3>{data[0].username}</h3>
			</div>
			{/*<p>My recipes:</p>
			<RecipeTable recipes={recipes.data}/>*/}
		</div>
	);
};