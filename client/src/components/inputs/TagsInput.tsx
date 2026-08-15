import { useQuery } from "@tanstack/react-query";
import type { RecipeData, TagData } from "../../DataInterfaces";
import { getTags } from "../../utils/otherQueries";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function TagsInput({
    tags,
    setRecipe
} : {
    tags : string[],
    setRecipe : (value: React.SetStateAction<RecipeData>) => void
}) {

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
		<ToggleButtonGroup
			value={tags}
			onChange={(e, newtags) =>
				setRecipe((prev) => ({
					...prev,
					'tags': newtags
				}))
			}
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
	);
};

