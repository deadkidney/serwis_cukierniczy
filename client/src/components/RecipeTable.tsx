import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../authContext";
import { useMixRecipes } from "../mixRecipesContext";
import type { RecipeShort } from '../DataInterfaces';
import Tags from "./Tags";
import { Alert, Box, Button, Card, CardActionArea, CardActions, CardContent, Grid, Typography } from '@mui/material';


export default function RecipeTable({
	recipes
} : {
	recipes: RecipeShort[]
}) {
	const {user} = useAuth();
	const {recipesToMix, addRecipeToMix} = useMixRecipes();

	if (recipes.length == 0)
		return (<Alert severity="info" color="secondary">No recipes here...</Alert>);

	return(
		<Box sx={{ flexGrow: 1 }}>
		<Grid container
		spacing={2}
		sx={{
			justifyContent: "flex-start",
			alignItems: "flex-start",
		}}
		>
			{recipes.map((recipe) => 
				<Grid key={recipe.id} size={{xs : 12, md: 4}}>
					<Card>
						<CardActionArea component={RouterLink} to={`/recipe/${recipe.id}`}>
						<CardContent>
							<Typography variant="h5" noWrap>
								{recipe.title}
							</Typography>
							<Tags tags={recipe.tags}/>
						</CardContent>
						</CardActionArea>
						<CardActions>
							<Button component={RouterLink} to={`/recipe/${recipe.id}`}>Show more</Button>
							{ user && !recipesToMix.includes(recipe.id) &&
								<Button onClick={() => addRecipeToMix(recipe.id)}> Add to Mix recipes</Button>
							}
						</CardActions>
					</Card>
				</Grid>
			)}		
		</Grid>
	</Box>
	)
};