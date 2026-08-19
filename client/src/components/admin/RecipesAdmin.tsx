import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { getNotAcceptedRecipes } from '../../utils/recipeQueries';
import RecipeTable from '../RecipeTable';
import LoadingScreen from '../LoadingScreen';
import { Alert, Container, Pagination } from '@mui/material';

export default function RecipesAdmin() {
	const [page, setPage] = useState(1);
	const limit = 12;
	
	const {data, isPending, isError} = useQuery({
		queryKey: ['recipes to accept', page],
		queryFn: () => getNotAcceptedRecipes(page - 1, limit),
		placeholderData: keepPreviousData,
		retry: 1
	});

	if (isPending)
		return (<LoadingScreen/>);

	if (isError)
		return (<Alert severity='error'>Couldn't find the recipes</Alert>);

	return (
		<Container>
			<RecipeTable recipes={data.rows}/>
			<Pagination 
				count={Math.ceil(data.count/limit)} 
				page={page} 
				onChange={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
			/>
		</Container>
	)
}
