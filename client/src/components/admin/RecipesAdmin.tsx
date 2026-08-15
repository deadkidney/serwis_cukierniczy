import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { getNotAcceptedRecipes } from '../../utils/recipeQueries';
import RecipeTable from '../RecipeTable';
import { Container, Pagination } from '@mui/material';

export default function RecipesAdmin() {
    const [page, setPage] = useState(1);
    const limit = 12;
    
    const {data, isLoading, isError} = useQuery({
        queryKey: ['recipes', page],
        queryFn: () => getNotAcceptedRecipes(page - 1, limit),
        placeholderData: keepPreviousData,
        retry: 1
    });

    if (isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the recipes</p>);

    return (
        <Container sx={{p:2}}>
            <RecipeTable recipes={data.rows}/>
            <Pagination 
                count={Math.ceil(data.count/limit)} 
                page={page} 
                onChange={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
            />
        </Container>
    )
}
