import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Box, AppBar, Button, Typography, Toolbar, IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ColorSchemeToggle from "./ColorSchemeToggle";

export default function Header() {
	const {user, deleteUserData} = useAuth();
	const navigate = useNavigate();

	const logout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
	  e.preventDefault();
	  deleteUserData();
	  navigate('/');
   };

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
					<IconButton component={RouterLink} to='/newrecipe' aria-label="add recipe" color="secondary" >
						<AddCircleIcon/>
					</IconButton>
					<Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
						Recipes
					</Typography>
					{user && user.role == 'ADMIN' && 
						<Button component={RouterLink} to='/admin' color="inherit">Admin</Button>
					}
					{user &&
						<Button
							component={RouterLink}
							to={"/recipesmix"}
							aria-label="account of current user"
							color="inherit"
						>
							Recipes mix
						</Button>
					}
					{user?
						<Button onClick={logout} color="inherit">Log out</Button> :
						<Button component={RouterLink} to='/login' color="inherit">Log in</Button>
					}
					{user &&
						<IconButton
							component={RouterLink}
							to={`/user/${user.id}`}
							aria-label="account of current user"
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
					}
					<ColorSchemeToggle/>
				</Toolbar>
			</AppBar>
		</Box>
	)
}