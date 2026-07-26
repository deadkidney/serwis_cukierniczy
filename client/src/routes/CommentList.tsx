import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByRecipe } from "../utils/otherQueries";
import { Link } from "react-router-dom";
import NewComment from "../components/NewComment";

export default function CommentList() {
    const {id} = useParams();
	if (!id) throw Error("no recipe id");

    const {data, isLoading, isError, isSuccess, refetch} = useQuery({
		queryKey: ['comments', {recipe: id}],
		queryFn: () => getCommentsByRecipe(id),
		retry: 1
	})

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
                    </div> 
                );
            })}
            <NewComment recipe_id={id} refetch={refetch} />
        </div>
    );
};