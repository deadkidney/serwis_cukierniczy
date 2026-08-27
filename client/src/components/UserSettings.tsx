import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useMixRecipes } from "../contexts/mixRecipesContext";
import { useMutation } from '@tanstack/react-query';
import { changePassword, deleteUser } from "../utils/userQueries";
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import type { UserData } from "../DataInterfaces";

export default function UserSettings({
	user
} : {
	user: UserData
}) {
	const navigate = useNavigate();
	const { deleteUserData } = useAuth();
	const { clearRecipesToMix } = useMixRecipes();
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const changePasswordMutation = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			setOldPassword('');
			setNewPassword('');
		},
		onError: () => alert('failed to change password')
	});

	const deleteUserMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			deleteUserData();
			clearRecipesToMix();
			navigate('/');
		},
		onError: () => alert('failed to delete')
	});

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
	  e.preventDefault();
	  changePasswordMutation.mutate({id: user.id, oldPassword, newPassword, token: user.token});
   };

   const handleDelete = () => {
	if(confirm("Are you sure? You can't undo this action."))
		deleteUserMutation.mutate({id: user.id, token: user.token})
   }

	return(
		<Stack
			spacing={2}
			sx={{
				justifyContent: "center",
					alignItems: "center",
			}}
		>
			<Typography>Change your password</Typography>
			<form onSubmit={handleSubmit}>
					<Stack spacing={1}>
						<TextField type="password" value={oldPassword} label="Old password" onChange={(e) => setOldPassword(e.target.value)} required fullWidth/>
						<TextField type="password" value={newPassword} label="New password" onChange={(e) => setNewPassword(e.target.value)} required fullWidth/>
						<Button type="submit">Change password</Button>
					</Stack>
				</form>
			<Button onClick={handleDelete}>
				Delete your account
			</Button>
		</Stack>
	)
}