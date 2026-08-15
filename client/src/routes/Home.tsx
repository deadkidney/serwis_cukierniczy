import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { getRecipes } from '../utils/recipeQueries';
import { getTags } from '../utils/otherQueries';
import RecipeTable from '../components/RecipeTable';
import { Box, Button, Container, Pagination, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { TagData } from '../DataInterfaces';

export default function Home() {
	const [searchVal, setSearchVal] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [page, setPage] = useState(1);
	const limit = 12;
    
	const {data, isLoading, isError, isSuccess, refetch} = useQuery({
        queryKey: ['recipes', page],
        queryFn: () => getRecipes(searchVal, tags, page - 1, limit),
		placeholderData: keepPreviousData,
        retry: 1
    });

	const possibletags = useQuery({
		queryKey: ['tags'],
		queryFn: () => getTags(),
		retry: 1,
		staleTime: 60000
	})

	if (possibletags.isLoading)
        return (<p>Loading...</p>);

	if (possibletags.isError)
        return (<p>Something went wrong</p>);

	return (
       	<div>
			<Container sx={{p: 2}}>
				<Box>
					<Button onClick={() => {setSearchVal(''); setTags([]), setPage(1)}}>
						<ClearIcon />
					</Button>
					<TextField 
						value={searchVal}
						label="Search field"
						type="search"
						onChange={(e) => setSearchVal(e.target.value)} 
						size="small"
					/>
					<Button onClick={() => {setPage(1); refetch()}} >
						<SearchIcon />
					</Button>
				</Box>
				<ToggleButtonGroup
					value={tags}
					onChange={(e, newtags) => setTags(newtags)}
					aria-label="tags"
					size="small"
					color="secondary"
				>
					{possibletags.data.map((tag: TagData) => 
						<ToggleButton key={tag.id} value={tag.name} aria-label={tag.name}>
							{tag.name}
						</ToggleButton>
					)}
				</ToggleButtonGroup>
			</Container>
			<Container sx={{p:2}}>
			{isLoading && <p> Loading... </p>}
			{isError && <p> Couldn't find the recipes </p>}
			{isSuccess && <RecipeTable recipes={data.rows}/>}
			{isSuccess && 
			<Pagination 
				count={Math.ceil(data.count/limit)} 
				page={page} 
				onChange={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
			/>}
			</Container>
        </div>
    )
}
