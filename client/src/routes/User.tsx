import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../utils/userQueries";
import AuthoredRecipes from "../components/AuthoredRecipes";
import LikedRecipes from "../components/LikedRecipes";
import { useState } from "react";

export default function User() {
	const {id} = useParams();
	if (!id) throw Error("no user id");

	const [kind, setKind] = useState<'authored' | 'liked'>('authored');

	const {data, isLoading, isError} = useQuery({
		queryKey: ['user', {id: id}],
        queryFn: () => getUserById(id),
		retry: 1
	})

	if (isLoading) 
        return (<p>Loading...</p>);

    if (isError) 
        return (<p>Couldn't find the user</p>);

	return (
		<div>
			<h3>{data[0].username}</h3>
			{kind == 'authored' ?
			<button onClick={() => setKind('liked')}>Show liked recipes</button>
			: <button onClick={() => setKind('authored')}>Show authored recipes</button>}
			{kind == 'authored' && <AuthoredRecipes/>}
			{kind == 'liked' && <LikedRecipes/>}
		</div>
	);
};