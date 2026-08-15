import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCommentsByRecipe, deleteComment } from "../utils/otherQueries";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../authContext";
import NewComment from "../components/NewComment";
import { Button, Container, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function CommentList() {
    const {id} = useParams();
	if (!id) throw Error("no recipe id");

    const {user} = useAuth();

    const {data, isLoading, isError, refetch} = useQuery({
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
  
    if (isLoading)
        return (<p>Loading...</p>);

    if (isError)
        return (<p>Couldn't find the comments</p>);

    return (
        <Container>
            <Button component={RouterLink} to={`/recipe/${id}`}>Back to recipe</Button>
            <NewComment recipe_id={id} refetch={refetch} />
            { data.length == 0 && <p>Nothing here...</p>}
            {data.map((comment) => {
                return(
                    <Stack key={comment.id} direction='row'>
                        <Button component={RouterLink} to={`/user/${comment.user_id}`}>{comment.username}</Button>
                        <Typography variant="body1">{comment.content}</Typography>
                        { user && (user.id == comment.user_id || user.role === 'ADMIN') &&
				            <IconButton onClick={() => deleteCommentMutation.mutate({id: comment.id, token: user.token})}>
                                <DeleteIcon/>
                            </IconButton>}
                    </Stack>
                );
            })}
        </Container>
    );
};