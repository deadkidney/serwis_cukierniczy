import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '../utils/recipeQueries';
import RecipeTable from '../components/RecipeTable';
import { Link } from 'react-router-dom';

export default function Home() {
    const {data, isLoading, isFetching, isError} = useQuery({
        queryKey: ['recipes'],
        queryFn: getAllRecipes,
        retry: 1
    });

    if (isLoading) 
        return (<p> Loading... </p>);

    if (isError) 
        return (<p> Couldn't find the recipes </p>);

    if (data.length == 0)
        return (<p> No recipes yet </p>)

    return (
        <div>
            <Link to='/newrecipe'> Create new recipe </Link>
            <RecipeTable recipes={data}/>
            {isFetching && <p>Updating...</p>}
        </div>
    )
}
