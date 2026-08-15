import { Checkbox, FormControlLabel, FormGroup, FormLabel, Stack } from "@mui/material";
import type { Ingredient } from "../DataInterfaces";

export default function Ingredients({
    ingredients
} : {
    ingredients: Ingredient[]
}) {
    
    return(
        <Stack spacing={2}>
            <FormGroup>
                <FormLabel>
                    Ingredients:
                </FormLabel>
                {ingredients.map((ingredient) =>
                    <FormControlLabel key={ingredient.id} control={<Checkbox />} 
                        label={`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`} />
                )}
            </FormGroup>
        </Stack>
        
    );
}