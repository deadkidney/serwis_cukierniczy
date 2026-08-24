import { Chip, Stack } from '@mui/material';

export default function Tags({
	tags
} : {
	tags: string[]
}) {

	if (tags.length == 0)
		return (<Chip label='This recipe has no tags' color='secondary' size='small' sx={{ margin: 2 }} />);

	return(
		<Stack
            direction="row"
            spacing={1}
            sx={{
                justifyContent: "flex-start",
                alignItems: "center",
				padding: 2
	        }}
        >
			{tags.map((tag) => {
				return <Chip key={tag} label={tag} color='secondary' size='small'/>
			})}
		</Stack>
		
	);
}