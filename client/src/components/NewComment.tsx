import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../authContext";
import { addComment } from "../utils/otherQueries";

export default function NewComment({
    recipe_id,
    refetch
} : {
    recipe_id : string,
    refetch: any
}) {
	const {user} = useAuth();

	if (!user)
		return <Link to='/login'>Log in to comment</Link>

	const [content, setContent] = useState("");

	const addCommentMutation = useMutation({
		mutationFn: addComment,
		onSuccess: () => {
            setContent('');
            refetch();
			alert('comment added successfully');
		},
		onError: () => alert('failed to add comment :c ')
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		addCommentMutation.mutate({data: {content: content, user_id: user.id, recipe_id: recipe_id}, token: user.token});
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<p>content:</p>
				<input type="text" value={content} name="content" onChange={(e) => setContent(e.target.value)} />
				<button type="submit" disabled={addCommentMutation.isPending}>
					{addCommentMutation.isPending ? "Posting..." : "Post"}
				</button>
			</form>
		</div>
	);
};
