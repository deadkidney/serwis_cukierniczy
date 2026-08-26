import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../utils/authenticationFunctions";
import { useAuth } from "../../contexts/authContext";
import { Button, Stack, TextField, Typography } from "@mui/material";

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
		<Stack
			spacing={3} 
			sx={{
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Typography variant="h4" align="center">
				Don't have an account yet?
			</Typography>
			<form onSubmit={handleSubmit}>
				<Stack spacing={2}>
					<TextField value={username} label="Username" onChange={(e) => setUsername(e.target.value)} required fullWidth/>
					<TextField type="password" value={password} label="Password" onChange={(e) => setPassword(e.target.value)} required fullWidth/>
					<Button type="submit">Register</Button>
				</Stack>
            </form>
		</Stack>
	);
};
