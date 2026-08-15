import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserById } from "../utils/userQueries";
import { useState } from "react";
import { getLikedRecipes, getRecipesByAuthor } from "../utils/recipeQueries";
import RecipeTable from "../components/RecipeTable";
import { Container, Pagination, ToggleButton, ToggleButtonGroup } from "@mui/material";

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

	if (user.isLoading || authored.isLoading || favourites.isLoading) 
        return (<p>Loading...</p>);

    if (user.isError || authored.isError || favourites.isError) 
        return (<p>Couldn't find the user</p>);

	return (
		<Container>
			<h3>{user.data.username}</h3>
			<ToggleButtonGroup
				value={kind}
				exclusive
				onChange={(e, kind) => setKind(kind)}
				color="primary"
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