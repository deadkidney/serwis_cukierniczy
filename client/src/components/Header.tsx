import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Box, AppBar, Typography, Toolbar, IconButton, Button } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UserMenu from "./UserMenu";

export default function Header() {
	const {user} = useAuth();
	const navigate = useNavigate();

   return(
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
					onClick={() => navigate(-1)}
					size="large"
					aria-label="back"
					color="inherit"
					>
						<ArrowBackRoundedIcon />
					</IconButton>
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
					<UserMenu /> :
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