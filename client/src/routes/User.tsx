import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";
import { getUserById } from "../utils/userQueries";
import { useState } from "react";
import { getFavouriteRecipes, getRecipesByAuthor } from "../utils/recipeQueries";
import RecipeTable from "../components/RecipeTable";
import UserSettings from "../components/UserSettings";
import LoadingScreen from "../components/LoadingScreen";
import { Alert, Box, Container, Pagination, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

export default function User() {
	const {id} = useParams();
	if (!id) throw Error("no user id");

	const {user} = useAuth();

	const [kind, setKind] = useState<'authored' | 'favourites' | 'settings'>('authored');
	const [page, setPage] = useState(1);
	const limit = 9;

	const {data, isPending, isError } = useQuery({
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
		queryFn: () => getFavouriteRecipes(id, page - 1, limit),
		placeholderData: keepPreviousData,
		retry: 1
	});

	if (isPending || authored.isPending || favourites.isPending) 
        return (<LoadingScreen/>);

    if (isError || authored.isError || favourites.isError) 
        return (<Alert severity="error">Couldn't find the user</Alert>);

	return (
		<Container sx={{padding: 2}}>
			<Typography variant="h4" align="center">
				{data.username}
			</Typography>
			<ToggleButtonGroup
				value={kind}
				exclusive
				onChange={(e, kind) => {if(kind != null) {setKind(kind); setPage(1)}}}
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
				{ user && user.id == data.id && <ToggleButton value="settings" aria-label='settings'>
					Security Settings
				</ToggleButton>}
			</ToggleButtonGroup>
			{kind == 'settings' && user && user.id == data.id &&
				<UserSettings user={user}/>
			}
			{kind == 'authored' && 
				<Box>
					<RecipeTable recipes={authored.data.rows}/>
					<Pagination
						count={Math.ceil(authored.data.count / limit)} 
						page={page} 
						onChange={(e, value) => setPage(value)}
						sx={{ paddingTop: 2 }}
					/>
				</Box>
			}
			{kind == 'favourites' &&
				<Box>
					<RecipeTable recipes={favourites.data.rows}/>
					<Pagination
						count={Math.ceil(favourites.data.count / limit)} 
						page={page} 
						onChange={(e, value) => setPage(value)}
						sx={{ paddingTop: 2 }}
					/>
				</Box>
			}
		</Container>
	);
};