import { useState } from "react";
import type { Ingredient, RecipeData } from "../../DataInterfaces";
import { Alert, Button, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

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
		if(ingredient.name == '' || ingredient.unit == '')
			return alert('fill all fields')
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

	const units = ['ml', 'l', 'g', 'cups', 'tablespoons', 'teaspoons', 'piece']
	
	return (
		<div>
			<Typography variant='h5'>Ingredients:</Typography>
			<Stack 
				direction="row"
				spacing={1}
				sx={{
					justifyContent: "flex-start",
					alignItems: "center",
				}}
			>
				<TextField value={ingredient.amount} name="amount" label="amount" onChange={onChangeHandler} fullWidth/>
				<TextField select value={ingredient.unit} name="unit" label="unit" onChange={onChangeHandler} fullWidth>
						{units.map((unit) => 
						<MenuItem key={unit} value={unit}>{unit}</MenuItem>
					)}
				</TextField>
				<TextField value={ingredient.name} name="name" label="name" onChange={onChangeHandler} fullWidth/>
				<Button type="button" onClick={handleAddIngredient} fullWidth>
					Add ingredient
				</Button>
			</Stack>
			<div>
					{ingredients.map((ingredient) => 
						<Stack direction='row' key={ingredient.id}>
							<Typography >
								{ingredient.amount} {ingredient.unit} {ingredient.name}
							</Typography>
							<IconButton type="button" onClick={() => handleDeleteIngredient(ingredient.id)}>
								<DeleteIcon/>
							</IconButton>
						</Stack>
					)}
				<Alert severity="warning">Don't forget to add all ingredients before submitting!</Alert>
			</div>
		</div>
	);
};
