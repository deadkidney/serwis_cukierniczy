import { useParams } from "react-router-dom";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getLikedRecipes } from '../utils/recipeQueries';
import { useState } from 'react';
import RecipeTable from '../components/RecipeTable';
import Pagination from "./Pagination";

export default function LikedRecipes() {
    const {id} = useParams();
	if (!id) throw Error("no user id");
    
	const [page, setPage] = useState(0);
	const limit = 2;
    
	const {data, isLoading, isError} = useQuery({
        queryKey: ['liked', {user: id}, page],
        queryFn: () => getLikedRecipes(id, page, limit),
		placeholderData: keepPreviousData,
        retry: 1
    });

    if (isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the recipes</p>);


	return (
       	<div>
            <h3>Liked recipes</h3>
			<RecipeTable recipes={data.rows}/>
			<Pagination page={page} limit={limit} count={data.count} setPage={setPage}/>
        </div>
    )
}
