import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../authContext";
import { addComment } from "../../utils/otherQueries";
import { Button, Stack, TextField } from "@mui/material";

export default function NewComment({
    recipe_id,
    refetch
} : {
    recipe_id : string,
    refetch: any
}) {
	const {user} = useAuth();

	if (!user)
		return <Button component={RouterLink} to='/login'>Log in to comment</Button>

	const [content, setContent] = useState("");

	const addCommentMutation = useMutation({
		mutationFn: addComment,
		onSuccess: () => {
            setContent('');
            refetch();
		},
		onError: () => alert('failed to add comment')
	});

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		addCommentMutation.mutate({data: {content: content, user_id: user.id, recipe_id: recipe_id}, token: user.token});
	};

	return (
		<form onSubmit={handleSubmit}>
			<Stack 
				direction='column'
				sx={{
					justifyContent: "space-between",
					alignItems: "flex-end",
				}}
			>
				<TextField multiline value={content} id="content" label="comment" onChange={(e) => setContent(e.target.value)} minRows={5} maxRows={20} required fullWidth/>
				<Button type="submit" disabled={addCommentMutation.isPending} >
					{addCommentMutation.isPending ? "Posting..." : "Post"}
				</Button>
			</Stack>
		</form>
	);
};
