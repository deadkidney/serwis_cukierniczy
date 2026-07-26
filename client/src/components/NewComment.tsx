import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addComment } from "../utils/otherQueries";

export default function NewComment({
    recipe_id,
    refetch
} : {
    recipe_id : string,
    refetch: any
}) {
	
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

	const handleSubmit = () => {
		addCommentMutation.mutate({content: content, user_id: '4', recipe_id: recipe_id});
	};

	return (
		<div>
			<form>
				<p>content:</p>
				<input type="text" value={content} name="content" onChange={(e) => setContent(e.target.value)} />
			</form>
			<button onClick={handleSubmit} disabled={addCommentMutation.isPending}>
				{addCommentMutation.isPending ? "Posting..." : "Post"}
			</button>
		</div>
	);
};
