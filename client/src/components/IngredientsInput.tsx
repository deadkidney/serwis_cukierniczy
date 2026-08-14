import { useState } from "react";
import type { Ingredient, RecipeData } from "../DataInterfaces";

export default function IngredientsInput({
	ingredients,
	setRecipe
} : {
	ingredients : Ingredient[],
	setRecipe : (value: React.SetStateAction<RecipeData>) => void
}) {

	const [ingredient, setIngredient] = useState<Ingredient>({
		id: ingredients.length + 1,
		name: '',
		amount: 1,
		unit: ''
	});

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		setIngredient(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const handleAddIngredient = () => {
		setRecipe(prev => ({
			...prev,
			ingredients: [...prev.ingredients, ingredient]
		}))
		setIngredient(prev => ({
			id: prev.id + 1,
			name: '',
			amount: 1,
			unit: ''
		}))
	};

	const handleDeleteIngredient = (id: number) => {
		setRecipe(prev => ({
			...prev,
			ingredients: prev.ingredients.filter((ingredient) => ingredient.id != id)
		}))
	};
	
	return (
		<div>
			<div>
			<p>Ingredients </p>
				{ingredients.map((ingredient) => 
					<div>
						<p key={ingredient.id}>{ingredient.amount} {ingredient.unit} {ingredient.name}</p>
						<button type="button" onClick={() => handleDeleteIngredient(ingredient.id)}>
							Delete
						</button>
					</div>
				)}
			</div>
			<div>
				<label htmlFor="amount">amount:</label>
				<input type="number" value={ingredient.amount} id="amount" name="amount" onChange={onChangeHandler}/>
				<label htmlFor="unit">unit:</label>
				<input type="text" value={ingredient.unit} id="unit" name="unit" onChange={onChangeHandler}/>
				<label htmlFor="name">name:</label>
				<input type="text" value={ingredient.name} id="name" name="name" onChange={onChangeHandler}/>
				<button type="button" onClick={handleAddIngredient}>
					Add ingredient
				</button>
			</div>
		</div>
	);
};
