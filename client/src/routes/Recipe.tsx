import { Link, useParams } from "react-router-dom";
import type { RecipeData } from "../DataInterfaces";
import { useState, useEffect } from "react";

export default function Recipe() {
	const {id} = useParams();
	console.log(id);
	const [loading, setLoading] = useState(true);
	const [recipe, setRecipe] = useState<RecipeData | {}>({});
	
	const getRecipe = async (id : string) => {
		try {
			const response = await fetch(`http://localhost:8080/api/recipeinfo?id=${id}`);
			if (!response.ok) {
				throw new Error(`${response.status}`)
			}
			const data = await response.json();
			setRecipe(data[0]);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	}
	
	useEffect(() => {
		getRecipe(id);
	}, []);

	return (
		<div>
			<Link to="/">Main</Link>
			{loading ?
			<p>Loading...</p> :
			<div key={recipe.id}>
				<h3>{recipe.title}</h3>
				<ul>
					{recipe.ingredients.map((ingredient) => {
					return(
						<li key={ingredient.id}>
							{ingredient.name}: {ingredient.amount} {ingredient.unit}
						</li>
					);
				})}
				</ul>
			</div>}
		</div>
	);
};