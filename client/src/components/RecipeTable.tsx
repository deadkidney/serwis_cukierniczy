import { Link as RouterLink } from "react-router-dom";
import type { RecipeShort } from '../DataInterfaces';
import Tags from "./Tags";
import { Alert, Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';

export default function RecipeTable({
	recipes
} : {
	recipes: RecipeShort[]
}) {

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
						<CardContent>
							<Typography variant="h5">
								{recipe.title}
							</Typography>
							<Tags tags={recipe.tags}/>
						</CardContent>
						<CardActions>
							<Button component={RouterLink} to={`/recipe/${recipe.id}`}>Show more</Button>
						</CardActions>
					</Card>
				</Grid>
			)}		
		</Grid>
	</Box>
	)
};