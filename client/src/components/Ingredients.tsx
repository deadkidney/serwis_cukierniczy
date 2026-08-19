import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel, Stack, TextField } from "@mui/material";
import type { Ingredient } from "../DataInterfaces";
import { useState } from "react";

export default function Ingredients({
    ingredients,
    portions
} : {
    ingredients: Ingredient[],
    portions: string
}) {
    const [newPortions, setNewPortions] = useState(portions);

    return(
        <Stack spacing={2}>
            <TextField value={newPortions} id="portions" label="Choose your portions" onChange={(e) => setNewPortions(e.target.value)}/>
            <Button type="button" onClick={() => setNewPortions(portions)}>Reset</Button>
            <FormGroup>
                <FormLabel>
                    Ingredients:
                </FormLabel>
                {ingredients.map((ingredient) =>
                    <FormControlLabel key={ingredient.id} control={<Checkbox />} 
                        label={`${ingredient.amount * parseFloat(newPortions) / parseFloat(portions)} ${ingredient.unit} ${ingredient.name}`} />
                )}
            </FormGroup>
        </Stack>
        
    );
}