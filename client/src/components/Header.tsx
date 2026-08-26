import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Box, AppBar, Typography, Toolbar, IconButton, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UserMenu from "./UserMenu";

export default function Header() {
	const {user} = useAuth();

   return(
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
					component={RouterLink}
					to='/'
					size="large"
					aria-label="home page"
					color="inherit"
					>
						<HomeIcon />
					</IconButton>
					<IconButton
						component={RouterLink}
						to='/newrecipe'
						size="large"
						aria-label="add recipe"
						color="secondary"
					>
						<AddCircleIcon/>
					</IconButton>
					<Typography
						variant="h5"
						component="div"
						sx={{ flexGrow: 1, padding: 2 }}>
						Recipes
					</Typography>
					
					{user ?
					<UserMenu user={user} /> :
					<Button
						component={RouterLink}
						to='/login'
						aria-label="login"
						color="inherit"
						>
							Log in
						</Button>
					}
				</Toolbar>
			</AppBar>
		</Box>
	)
}