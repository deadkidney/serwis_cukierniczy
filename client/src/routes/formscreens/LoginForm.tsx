import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../utils/authenticationFunctions";
import { useAuth } from "../../contexts/authContext";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import RegistrationForm from "./RegistrationForm";

export default function LoginForm() {
    const {setUserData} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			setUserData(data)
            navigate(-1);
		},
		onError: () => alert('failed to log in')
	});

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      loginMutation.mutate({username: username, password: password});
   };

	return (
		<Stack
			direction={{sm: 'column', md: 'row'}}
			spacing={{sm: 2, md: 4}}
			divider={<Divider orientation="vertical" flexItem />}
			sx={{
				justifyContent: "space-evenly",
				alignItems: "center",
				padding: 4
			}}
		>
		<Stack
			spacing={{sm: 2, md: 4}} 
			sx={{
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Typography variant="h4">
				Login
			</Typography>
			<form onSubmit={handleSubmit}>
				<Stack>
					<TextField value={username} label="Username" onChange={(e) => setUsername(e.target.value)} required fullWidth/>
					<TextField type="password" value={password} label="Password" onChange={(e) => setPassword(e.target.value)} required fullWidth/>
					<Button type="submit">Log in</Button>
				</Stack>
            </form>
		</Stack>
		<RegistrationForm/>
		</Stack>
	);
};
