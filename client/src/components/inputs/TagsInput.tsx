import { useQuery } from "@tanstack/react-query";
import type { RecipeData, TagData } from "../../DataInterfaces";
import { getTags } from "../../utils/otherQueries";
import LoadingScreen from "../LoadingScreen";
import { Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';

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

	if (possibletags.isPending)
        return (<LoadingScreen/>);

	if (possibletags.isError)
        return (<Alert severity="error">Something went wrong</Alert>);

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

