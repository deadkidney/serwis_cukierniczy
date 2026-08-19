import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCommentsByRecipe, deleteComment } from "../utils/otherQueries";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../authContext";
import NewComment from "../components/NewComment";
import LoadingScreen from "../components/LoadingScreen";
import { Alert, Button, Container, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function CommentList() {
    const {id} = useParams();
	if (!id) throw Error("no recipe id");

    const {user} = useAuth();

    const {data, isPending, isError, refetch} = useQuery({
		queryKey: ['comments', {recipe: id}],
		queryFn: () => getCommentsByRecipe(id),
		retry: 1
	})

    const deleteCommentMutation = useMutation({
		mutationFn: deleteComment,
		onSuccess: () => {
			refetch();
		},
		onError: () => alert('failed to delete')
	});
  
    if (isPending)
        return (<LoadingScreen/>);

    if (isError)
        return (<Alert severity="error">Couldn't find the comments</Alert>);

    return (
        <Container>
            <Button component={RouterLink} to={`/recipe/${id}`}>Back to recipe</Button>
            <NewComment recipe_id={id} refetch={refetch} />
            { data.length == 0 && <Alert severity="info">No comments yet...</Alert>}
            {data.map((comment: {id: string, user_id: string, username: string, content: string}) => {
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