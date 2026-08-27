import { useState } from "react";
import type { Ingredient } from "../DataInterfaces";
import { Checkbox, FormControlLabel, FormGroup, FormLabel, IconButton, Stack, TextField } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

export default function Ingredients({
	ingredients,
	portions
} : {
	ingredients: Ingredient[],
	portions: string
}) {
	const [newPortions, setNewPortions] = useState(portions);

	const round = (value: number) => {
		return Math.round(value * 100) / 100;
	}

	return(
		<Stack spacing={2}>
			<Stack direction="row" spacing={1}>
				<TextField value={newPortions} id="portions" label="Choose your portions" onChange={(e) => setNewPortions(e.target.value)}/>
				<IconButton type="button" onClick={() => setNewPortions(portions)}>
					<ClearIcon/>
				</IconButton>
			</Stack>
			<FormGroup>
				<FormLabel>
					Ingredients:
				</FormLabel>
				{ingredients.map((ingredient) =>
					<FormControlLabel key={ingredient.id} control={<Checkbox color="secondary"/>} 
						label={ Number.isNaN(parseFloat(newPortions)) ?
							`${ingredient.amount} ${ingredient.unit} ${ingredient.name}` :
							`${round(ingredient.amount * parseFloat(newPortions) / parseFloat(portions))} ${ingredient.unit} ${ingredient.name}`
						} />
				)}
			</FormGroup>
		</Stack>
		
	);
}