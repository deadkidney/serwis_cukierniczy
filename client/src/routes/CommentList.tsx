import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCommentsByRecipe, deleteComment } from "../utils/otherQueries";
import { Link } from "react-router-dom";
import { useAuth } from "../authContext";
import NewComment from "../components/NewComment";

export default function CommentList() {
    const {id} = useParams();
	if (!id) throw Error("no recipe id");

    const {user} = useAuth();

    const {data, isLoading, isError, isSuccess, refetch} = useQuery({
		queryKey: ['comments', {recipe: id}],
		queryFn: () => getCommentsByRecipe(id),
		retry: 1
	})

    const deleteCommentMutation = useMutation({
		mutationFn: deleteComment,
		onSuccess: () => {
			refetch();
			alert('deleted successfully');
		},
		onError: () => alert('failed to delete')
	});

    return (
        <div>
            <Link to={`/recipe/${id}`}>Back to recipe</Link>
            {isLoading && <p> Loading... </p>}
			{isError && <p> Couldn't find the comments </p>}
            {isSuccess && data.length == 0 && <p>Nothing here...</p>}
            {isSuccess && data.map((comment) => {
                return(
                    <div key={comment.id}>
                        <Link to={`/user/${comment.user_id}`}>{comment.username}</Link>
                        <p>{comment.content}</p>
                        { user && user.id == comment.user_id &&
				            <button onClick={() => deleteCommentMutation.mutate({id: comment.id, token: user.token})}>delete</button>}
                    </div>
                );
            })}
            <NewComment recipe_id={id} refetch={refetch} />
        </div>
    );
};