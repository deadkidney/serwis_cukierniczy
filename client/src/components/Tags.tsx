import { Chip, Stack } from '@mui/material';

export default function Tags({
	tags
} : {
	tags: string[]
}) {

	if (tags.length == 0)
		return (<p>This recipe has no tags</p>);

	return(
		<Stack
            direction="row"
            spacing={1}
            sx={{
                justifyContent: "flex-start",
                alignItems: "center",
	        }}
        >
			{tags.map((tag) => {
				return <Chip key={tag} label={tag} size="small"/>
			})}
		</Stack>
		
	);
}