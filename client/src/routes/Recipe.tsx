import { useParams } from "react-router-dom";
import { getRecipeById } from "../utils/recipeQueries";
import { useQuery } from "@tanstack/react-query";

export default function Recipe() {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {data, isLoading, isError} = useQuery({
		queryKey: ['recipes', {id: id}],
        queryFn: () => getRecipeById(id),
		retry: 1
	})

    if (isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the recipe</p>);

	return (
		<div>
			<div key={data[0].id}>
				<h3>{data[0].title}</h3>
				<p>Author: {data[0].user_id}</p>
				<p>{data[0].content}</p>
				<button>delete</button>
			</div>
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