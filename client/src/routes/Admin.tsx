import { useAuth } from "../contexts/authContext";
import { useState } from "react";
import { Alert, Container, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import UsersAdmin from "../components/admin/UsersAdmin";
import RecipesAdmin from "../components/admin/RecipesAdmin";


export default function Admin() {
    const {user} = useAuth();
    
    if(!user || user.role != 'ADMIN')
        return (<Alert severity="info" color="secondary">You can't access this page</Alert>); 

	const [kind, setKind] = useState<'recipes' | 'users'>('recipes');

	return (
		<Container sx={{padding: 2}}>
			<Typography variant="h4" align="center">
                Admin
            </Typography>
			<ToggleButtonGroup
				value={kind}
				exclusive
				onChange={(e, kind) => {if(kind != null) setKind(kind)}}
				color="secondary"
				fullWidth
				sx={{padding: 2}}
			>
				<ToggleButton value="recipes" aria-label='recipes' >
					Recipes to accept
				</ToggleButton>
				<ToggleButton value="users" aria-label='users'>
					Users
				</ToggleButton>
			</ToggleButtonGroup>
			{kind == 'recipes' ? 
            <RecipesAdmin user={user} /> : 
            <UsersAdmin user={user} />}
		</Container>
	);
};