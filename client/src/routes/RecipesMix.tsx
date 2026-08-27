import { useQueries } from "@tanstack/react-query";
import { getRecipeById } from "../utils/recipeQueries";
import { useMixRecipes } from "../contexts/mixRecipesContext";
import { Link as RouterLink} from "react-router-dom";
import Ingredients from "../components/Ingredients";
import LoadingScreen from "../components/LoadingScreen";
import { Alert, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from "../contexts/authContext";

export default function RecipesMix() {
	const {recipesToMix, deleteRecipeToMix, clearRecipesToMix} = useMixRecipes();
	const {user} = useAuth();

	if (!user)
		return (<Alert severity="info" color="secondary">
			You need to <Button component={RouterLink} to='/login'>Log in</Button> to mix recipes.
			</Alert>)

	const recipeQueries = useQueries({
		queries: recipesToMix.map((recipe) => {
			return {
				queryKey: ['recipe', {id: recipe}],
        		queryFn: () => getRecipeById(recipe),
				retry: 1
			}
		})
		
	})

    if (recipeQueries.some((recipe) => recipe.isPending))
        return (<LoadingScreen/>);

    if (recipeQueries.some((recipe) => recipe.isError))
        return (<Alert severity="error">Couldn't find the recipes.</Alert>);

	if(recipeQueries.some((recipe) => !recipe.data) || recipesToMix.length == 0)
		return (<Alert severity="info" color="secondary">
			Choose recipes to mix <Button component={RouterLink} to='/'>here</Button>
		</Alert>);


	return (
		<Stack 
			direction='column'
			spacing={{sm: 2, md: 4}}
			sx={{
				justifyContent: "flex-start",
				alignItems: "center",
				padding: 2
			}}
		>
			<Typography variant="h4">Multiple recipes</Typography>
			<Stack>
				{recipeQueries.map((recipe) => 
					<Stack key={recipe.data.id}
						direction="row"
						sx={{
							justifyContent: "space-between",
							alignItems: "center"
						}}
					>
						<Typography variant="h6"> {recipe.data.title}</Typography>
						<IconButton onClick={() => deleteRecipeToMix(recipe.data.id)}>
							<DeleteIcon/>
						</IconButton>
					</Stack>
				)}
				<Button onClick={clearRecipesToMix}>Clear</Button>
			</Stack>
			<Stack
				direction={{sm: 'column', md: 'row'}}
				spacing={{sm: 2, md: 4}}
				divider={<Divider orientation="vertical" flexItem />}
				sx={{
					justifyContent: "space-evenly",
					alignItems: "flex-start",
				}}
			>
				<Stack 
				spacing={2}
				>
				{recipeQueries.map((recipe) => 
					<Stack key={recipe.data.id} spacing={2}>
						<Typography variant="h5" align="center"> {recipe.data.title}</Typography>
						<Ingredients ingredients={recipe.data.ingredients} portions={recipe.data.portions} />
					</Stack>
				)}
				</Stack>
				<Stack
					spacing={2}
				>
				{recipeQueries.map((recipe) => 
					<Stack key={recipe.data.id}
						spacing={2}
					>
						<Typography variant="h5" align="center"> {recipe.data.title}</Typography>
						<Typography sx={{whiteSpace: 'pre-wrap'}}>{recipe.data.content}</Typography>
					</Stack>		
				)}
				</Stack>
			</Stack>
		</Stack>	
	);
};