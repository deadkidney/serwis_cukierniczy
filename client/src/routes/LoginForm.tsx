import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../utils/authenticationFunctions";
import { useAuth } from "../authContext";

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
			alert('loged in successfully');
		},
		onError: () => alert('failed to log in :c ')
	});

    const handleSubmit = async (e) => {
      e.preventDefault();
      loginMutation.mutate({username: username, password: password});
   };

	return (
		<div>
            <h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<p>username:</p>
				<input type="text" value={username} name="username" onChange={(e) => setUsername(e.target.value)} required/>
				<p>password:</p>
				<input type="password" value={password} name="password" onChange={(e) => setPassword(e.target.value)} required/>
			<button type="submit">Log in</button>
            </form>
		</div>
	);
};
