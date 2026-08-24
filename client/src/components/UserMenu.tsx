import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { Box, Button, IconButton, Menu, MenuItem, Stack, useMediaQuery } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function UserMenu() {
	const {user, deleteUserData} = useAuth();
	const navigate = useNavigate();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

	const logout = async () => {
	  deleteUserData();
	  navigate('/');
	}

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	if(isMobile)
		return(
			<Box>	
				<IconButton
					onClick={handleClick}
					color="inherit"
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open}
				>
					<AccountCircle />
				</IconButton>
				<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				>
					<MenuItem>
						<Button
							component={RouterLink}
							to={`/user/${user.id}`}
							aria-label="account of current user"
							color="inherit"
						>
							My account
						</Button>
					</MenuItem>
					<MenuItem>
						<Button
							component={RouterLink}
							to='/recipesmix'
							aria-label="recipes mix"
							color="inherit"
						>
							Recipes mix
						</Button>
					</MenuItem>
				{user.role == 'ADMIN' && 
						<MenuItem>
							<Button
								component={RouterLink}
								to='/admin'
								aria-label="admin"
								color="inherit"
							>
								Admin
							</Button>
						</MenuItem>
					}
					<MenuItem>
							<Button
								onClick={logout}
								aria-label="logout"
								color='secondary'
							>
								Log out
							</Button>
						</MenuItem>
				</Menu>
			</Box>		
		)
	else
		return(
		<Stack
			direction='row'
			spacing={0.5}
		>
			{user.role == 'ADMIN' && 
				<Button component={RouterLink} to='/admin' aria-label="admin" color="inherit">Admin</Button>
			}
			<Button
				component={RouterLink}
				to={"/recipesmix"}
				aria-label="recipes mix"
				color="inherit"
			>
				Recipes mix
			</Button>
			<Button onClick={logout} aria-label="logout" color="secondary">Log out</Button>
			<IconButton
				component={RouterLink}
				to={`/user/${user.id}`}
				aria-label="account of current user"
				color="inherit"
			>
				<AccountCircle />
			</IconButton>
			<ColorSchemeToggle />
		</Stack>
	)
}