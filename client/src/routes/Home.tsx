import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { getRecipes } from '../utils/recipeQueries';
import { getTags } from '../utils/otherQueries';
import RecipeTable from '../components/RecipeTable';
import type { TagData } from '../DataInterfaces';
import LoadingScreen from '../components/LoadingScreen';
import { Alert, Button, Container, Pagination, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function Home() {
	const [searchVal, setSearchVal] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [page, setPage] = useState(1);
	const limit = 12;
    
	const {data, isPending, isError, refetch} = useQuery({
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

	if (isPending || possibletags.isPending)
        return (<LoadingScreen/>);

	if (isError || possibletags.isError)
        return (<Alert severity='error'>Something went wrong</Alert>);

	return (
       	<Container sx={{padding: 2}}>
			<Stack 
				direction={{sm: 'column', md: 'row'}} 
				spacing={2}
				sx={{
					justifyContent: "center",
					alignItems: "center",
					paddingBottom: 2
				}}
			>
				<Button onClick={() => {setSearchVal(''); setTags([]), setPage(1)}}>
					<ClearIcon />
				</Button>
				<TextField 
					value={searchVal}
					label="Search field"
					type="search"
					onChange={(e) => setSearchVal(e.target.value)} 
					fullWidth
				/>
				<ToggleButtonGroup
					value={tags}
					onChange={(e, newtags) => setTags(newtags)}
					aria-label="tags"
					color="secondary"
					
				>
					{possibletags.data.map((tag: TagData) => 
						<ToggleButton key={tag.id} value={tag.name} aria-label={tag.name}>
							{tag.name}
						</ToggleButton>
					)}
				</ToggleButtonGroup>
				<Button onClick={() => {setPage(1); refetch()}} >
					<SearchIcon />
				</Button>
			</Stack>
				<RecipeTable recipes={data.rows}/>
				<Pagination 
					count={Math.ceil(data.count/limit)} 
					page={page} 
					onChange={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
				/>
        </Container>
    )
}
