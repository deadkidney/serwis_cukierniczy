import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserById } from "../utils/userQueries";
import { useState } from "react";
import { getLikedRecipes, getRecipesByAuthor } from "../utils/recipeQueries";
import RecipeTable from "../components/RecipeTable";
import LoadingScreen from "../components/LoadingScreen";
import { Alert, Container, Pagination, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

export default function User() {
	const {id} = useParams();
	if (!id) throw Error("no user id");

	const [kind, setKind] = useState<'authored' | 'favourites'>('authored');
	const [page, setPage] = useState(1);
	const limit = 12;

	const user = useQuery({
		queryKey: ['user', {id: id}],
        queryFn: () => getUserById(id),
		retry: 1
	})

	const authored = useQuery({
		queryKey: ['authored', {author: id}, page],
		queryFn: () => getRecipesByAuthor(id, page - 1, limit),
		placeholderData: keepPreviousData,
		retry: 1
	});

	const favourites = useQuery({
		queryKey: ['favourites', {user: id}, page],
		queryFn: () => getLikedRecipes(id, page - 1, limit),
		placeholderData: keepPreviousData,
		retry: 1
	});

	if (user.isPending || authored.isPending || favourites.isPending) 
        return (<LoadingScreen/>);

    if (user.isError || authored.isError || favourites.isError) 
        return (<Alert severity="error">Couldn't find the user</Alert>);

	return (
		<Container sx={{padding: 2}}>
			<Typography variant="h4" align="center">
				{user.data.username}
			</Typography>
			<ToggleButtonGroup
				value={kind}
				exclusive
				onChange={(e, kind) => setKind(kind)}
				color="secondary"
				fullWidth
				sx={{padding: 2}}
			>
				<ToggleButton value="authored" aria-label='authored' >
					Authored Recipes
				</ToggleButton>
				<ToggleButton value="favourites" aria-label='favourites'>
					Favourite Recipes
				</ToggleButton>
			</ToggleButtonGroup>
			<RecipeTable recipes={kind == 'authored' ? authored.data.rows : favourites.data.rows}/>
			<Pagination
				count={Math.ceil(kind == 'authored' ? authored.data.count / limit : favourites.data.count / limit)} 
				page={page} 
				onChange={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
			/>
		</Container>
	);
};