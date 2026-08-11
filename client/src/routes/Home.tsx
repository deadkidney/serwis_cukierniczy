import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getRecipes } from '../utils/recipeQueries';
import { useState } from 'react';
import RecipeTable from '../components/RecipeTable';
import Pagination from '../components/Pagination';

export default function Home() {
	const [searchVal, setSearchVal] = useState('');
	const [page, setPage] = useState(0);
	const limit = 2;
    
	const {data, isLoading, isError, isSuccess, refetch} = useQuery({
        queryKey: ['recipes', page],
        queryFn: () => getRecipes(searchVal, page, limit),
		placeholderData: keepPreviousData,
        retry: 1
    });

	return (
       	<div>
			<button onClick={() => {setSearchVal(''); setPage(0); refetch()}}>see all</button>
           	<input type="text" value={searchVal} name="search" onChange={(e) => setSearchVal(e.target.value)} />
			<button onClick={() => {setPage(0); refetch()}}>search</button>
			{isLoading && <p> Loading... </p>}
			{isError && <p> Couldn't find the recipes </p>}
			{isSuccess && <RecipeTable recipes={data.rows}/>}
			{isSuccess && <Pagination page={page} limit={limit} count={data.count} setPage={setPage}/>}
        </div>
    )
}
