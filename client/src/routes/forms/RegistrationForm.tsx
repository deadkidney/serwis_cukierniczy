import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../utils/authenticationFunctions";
import { useAuth } from "../../authContext";

export default function RegistrationForm() {
    const {setUserData} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const registrationMutation = useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			setUserData(data)
            navigate(-2);
			alert('registered and loged in successfully');
		},
		onError: () => alert('failed to register :c')
	});

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      registrationMutation.mutate({username: username, password: password});
   };

	return (
		<div>
            <h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<p>username:</p>
				<input type="text" value={username} name="username" onChange={(e) => setUsername(e.target.value)} required/>
				<p>password:</p>
				<input type="password" value={password} name="password" onChange={(e) => setPassword(e.target.value)} required/>
			<button type="submit">Register</button>
            </form>
		</div>
	);
};
