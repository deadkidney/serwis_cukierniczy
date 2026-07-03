import { Link, useParams } from "react-router-dom";
import type { UserData } from "../DataInterfaces";
import { useState, useEffect } from "react";

export default function User() {
	const {id} = useParams();
	console.log(id);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserData | {}>({});
	
	const getUser = async (id : string) => {
		try {
			const response = await fetch(`http://localhost:8080/api/userinfo?id=${id}`);
			if (!response.ok) {
				throw new Error(`${response.status}`)
			}
			const data = await response.json();
			setUser(data[0]);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	}
	
	useEffect(() => {
		getUser(id);
	}, []);

	return (
		<div>
			<Link to="/">Main</Link>
			{loading ?
			<p>Loading...</p> :
			<div key={user.id}>
				<h3>{user.username}</h3>
			</div>}
		</div>
	);
};