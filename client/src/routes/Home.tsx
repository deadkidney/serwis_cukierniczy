import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getRecipes } from '../utils/recipeQueries';
import { useState } from 'react';
import RecipeTable from '../components/RecipeTable';
import Pagination from '../components/Pagination';
import { getTags } from '../utils/otherQueries';

export default function Home() {
	const [searchVal, setSearchVal] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [page, setPage] = useState(0);
	const limit = 2;
    
	const {data, isLoading, isError, isSuccess, refetch} = useQuery({
        queryKey: ['recipes', page],
        queryFn: () => getRecipes(searchVal, tags, page, limit),
		placeholderData: keepPreviousData,
        retry: 1
    });

	const possibletags = useQuery({
		queryKey: ['tags'],
		queryFn: () => getTags(),
		retry: 1,
		staleTime: 60000
	})

	const onChangeTagHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		setTags((prev) => e.target.checked ? [...prev, e.target.value] : prev.filter((tag) => tag != e.target.value))
	}

	if (possibletags.isLoading)
        return (<p>Loading...</p>);

	if (possibletags.isError)
        return (<p>Something went wrong</p>);

	return (
       	<div>
			<button onClick={() => {setSearchVal(''); setTags([]), setPage(0)}}>clear</button>
           	<input type="text" value={searchVal} name="search" onChange={(e) => setSearchVal(e.target.value)} />
			<button onClick={() => {setPage(0); refetch()}}>search</button>
			<label>tags:</label>
				<div>
					{possibletags.data.map((tag) => {
							return (<div key={tag.id}>
								<input type="checkbox" value={tag.name} id={tag.id} name="tags" onChange={onChangeTagHandler} checked={tags.includes(tag.name)}/>
								<label htmlFor={tag.id}>{tag.name}</label>
							</div>)
					})}
				</div>
			{isLoading && <p> Loading... </p>}
			{isError && <p> Couldn't find the recipes </p>}
			{isSuccess && <RecipeTable recipes={data.rows}/>}
			{isSuccess && <Pagination page={page} limit={limit} count={data.count} setPage={setPage}/>}
        </div>
    )
}
