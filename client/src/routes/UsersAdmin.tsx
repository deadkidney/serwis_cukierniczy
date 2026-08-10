import { useQuery, useMutation } from '@tanstack/react-query';
import { deleteUser, getAllUsers, changeRole } from '../utils/userQueries';
import { Link } from "react-router-dom";
import { useAuth } from "../authContext";

export default function UsersAdmin() {
    const {user} = useAuth();

    if(!user || user.role != 'ADMIN')
        return (<p>You can't access this page</p>); 
    
	const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ['users'],
        queryFn: () => getAllUsers(user.token),
        retry: 1
    });

    const deleteUserMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
            refetch();
            alert('deleted successfully');
        },
		onError: () => alert('failed to delete')
	});

    const changeRoleMutation = useMutation({
		mutationFn: changeRole,
		onSuccess: () => {
            refetch();
            alert('changed role successfully')
        },
		onError: () => alert('failed to change role')
	});

    if (isLoading)
        return (<p>Loading...</p>);

	if (isError)
        return (<p>Couldn't find the users</p>);

	return (
       	<div>
			{data.map((u) => {
                return(
                    <section key={u.id}>
                        <Link to={`/user/${u.id}`}>{u.username}</Link>
                        <p>{u.role}</p>
                        {u.id != user.id && <button onClick={() => changeRoleMutation.mutate({id: u.id, token: user.token})}>make an admin</button>}
                        <button onClick={() => deleteUserMutation.mutate({id: u.id, token: user.token})}>delete</button>
                    </section>
                );
            })}
        </div>
    )

}
