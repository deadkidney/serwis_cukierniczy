import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../utils/authenticationFunctions";
import { useAuth } from "../../authContext";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
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
		<Box>
		<Card variant="outlined" sx={{ maxWidth: 345 }}>
			<CardContent>
			<Typography variant="h3">
				Login
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField value={username} label="Username" onChange={(e) => setUsername(e.target.value)} required/>
				<TextField value={password} label="Password" onChange={(e) => setPassword(e.target.value)} required type="password"/>
				<Button type="submit">Log in</Button>
            </form>
			</CardContent>
		</Card>
		<Typography variant="h6">
			Don't have an account yet?
		</Typography>
		<RegistrationForm/>
		</Box>
	);
};
