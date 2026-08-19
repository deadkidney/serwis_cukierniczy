import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../utils/authenticationFunctions";
import { useAuth } from "../../authContext";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";

export default function RegistrationForm() {
    const {setUserData} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const registrationMutation = useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			setUserData(data)
            navigate(-1);
		},
		onError: () => alert('failed to register')
	});

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      registrationMutation.mutate({username: username, password: password});
   };

	return (
		<Card variant="outlined" sx={{ maxWidth: 345 }}>
			<CardContent>
			<Typography variant="h3">
				Register
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField value={username} label="Username" onChange={(e) => setUsername(e.target.value)} required/>
				<TextField value={password} label="Password" onChange={(e) => setPassword(e.target.value)} required type="password"/>
				<Button type="submit">Register</Button>
            </form>
			</CardContent>
		</Card>
	);
};
