import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '../utils/recipeQueries';
import { useState } from 'react';
import RecipeTable from '../components/RecipeTable';

export default function Home() {
	const [searchVal, setSearchVal] = useState('');
    
	const {data, isLoading, isError, isSuccess, refetch} = useQuery({
        queryKey: ['recipes'],
        queryFn: () => getRecipes(searchVal),
        retry: 1
    });

	return (
       	<div>
           	<input type="text" value={searchVal} name="search" onChange={(e) => setSearchVal( e.target.value)} />
			<button onClick={() => refetch()}>search</button>
			{isLoading && <p> Loading... </p>}
			{isError && <p> Couldn't find the recipes </p>}
			{isSuccess && <RecipeTable recipes={data}/>}
        </div>
    )

}
