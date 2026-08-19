import { useAuth } from "../authContext";
import { useState } from "react";
import { Alert, Container, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import UsersAdmin from "../components/admin/UsersAdmin";
import RecipesAdmin from "../components/admin/RecipesAdmin";


export default function Admin() {
    const {user} = useAuth();
    
    if(!user || user.role != 'ADMIN')
        return (<Alert severity="info">You can't access this page</Alert>); 

	const [kind, setKind] = useState<'recipes' | 'users'>('recipes');

	return (
		<Container>
			<Typography variant="h4">
                Admin
            </Typography>
			<ToggleButtonGroup
				value={kind}
				exclusive
				onChange={(e, kind) => setKind(kind)}
				color="primary"
			>
				<ToggleButton value="recipes" aria-label='recipes' >
					Recipes to accept
				</ToggleButton>
				<ToggleButton value="users" aria-label='users'>
					Users
				</ToggleButton>
			</ToggleButtonGroup>
			{kind == 'recipes' ? 
            <RecipesAdmin/> : 
            <UsersAdmin user={user}/>}
		</Container>
	);
};