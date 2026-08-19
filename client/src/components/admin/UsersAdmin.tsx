import { useQuery, useMutation } from '@tanstack/react-query';
import { Link as RouterLink } from "react-router-dom";
import { deleteUser, getAllUsers, changeRole } from '../../utils/userQueries';
import type { UserData } from '../../DataInterfaces';
import LoadingScreen from '../LoadingScreen';
import { Alert, Button, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export default function UsersAdmin({
	user
} : {
	user: UserData
}) {
	const [page, setPage] = useState(1);
	const limit = 5;

	const {data, isPending, isError, refetch} = useQuery({
		queryKey: ['users', page],
		queryFn: () => getAllUsers(page - 1, limit, user.token),
		retry: 1
	});

	const deleteUserMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			refetch();
		},
		onError: () => alert('failed to delete')
	});

	const changeRoleMutation = useMutation({
		mutationFn: changeRole,
		onSuccess: () => {
			refetch();
		},
		onError: () => alert('failed to change role')
	});

	if (isPending)
		return (<LoadingScreen/>);

	if (isError)
		return (<Alert severity='error'>Couldn't find the users</Alert>);

	return(
	<TableContainer component={Paper}>
		<Table sx={{ minWidth: 650 }} aria-label="users table">
		<TableHead>
			<TableRow>
			<TableCell>Username</TableCell>
			<TableCell align="right">Role</TableCell>
			<TableCell></TableCell>
			<TableCell>Actions</TableCell>
			<TableCell></TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{data.rows.map((u : UserData) => (
			<TableRow
				key={u.id}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			>
				<TableCell component="th" scope="row">{u.username}
				</TableCell>
				<TableCell align="right">{u.role}</TableCell>
				<TableCell align="right">
					<Button component={RouterLink} to={`/user/${u.id}`}>Go to profile</Button>
				</TableCell>
				<TableCell align="right">
					<Button onClick={() => changeRoleMutation.mutate({id: u.id, token: user.token})} disabled={u.role == 'ADMIN'}>
						Make admin
					</Button>
				</TableCell>
				<TableCell align="right">
				<IconButton onClick={() => deleteUserMutation.mutate({id: u.id, token: user.token})} disabled={u.id == user.id}>
					<DeleteIcon/>
				</IconButton>
				</TableCell>
			</TableRow>
			))}
		</TableBody>
		</Table>
		<Pagination 
			count={Math.ceil(data.count/limit)} 
			page={page} 
			onChange={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
		/>
	</TableContainer>
	)
}