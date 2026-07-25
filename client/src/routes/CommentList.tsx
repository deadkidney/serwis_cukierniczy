import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByRecipe } from "../utils/otherQueries";
import { Link } from "react-router-dom";

export default function CommentList() {
    const {id} = useParams();
	if (!id) throw Error("no recipe id");

    const {data, isLoading, isError} = useQuery({
		queryKey: ['comments', {recipe: id}],
		queryFn: () => getCommentsByRecipe(id),
		retry: 1
	})

    if (isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the comments</p>);


    if (data.length == 0)
        return (<p>Nothing here...</p>);

    return (
        <div>
            <Link to={`/recipe/${id}`}>Back to recipe</Link>
            {data.map((comment) => {
                return(
                    <div key={comment.id}>
                        <Link to={`/user/${comment.user_id}`}>{comment.username}</Link>
                        <h3>{comment.content}</h3>
                    </div> 
                );
            })}
        </div>
    );
};