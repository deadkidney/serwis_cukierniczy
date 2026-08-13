import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addRecipe } from "../../utils/recipeQueries";
import type { RecipeData } from "../../DataInterfaces";
import { getTags } from "../../utils/otherQueries";

export default function AddRecipeForm() {
	let navigate = useNavigate();
	const {user} = useAuth();

	if (!user)
		return <Link to='/login'>Log in to add recipe</Link>
	
	const [recipe, setRecipe] = useState<RecipeData>({
		id: "",
		title: "",
		user_id: user.id,
		content: "",
		portions: 1,
		tags: [],
		accepted: false
	});

	const possibletags = useQuery({
		queryKey: ['tags'],
        queryFn: () => getTags(),
		retry: 1,
		staleTime: 60000
	})

	const addRecipeMutation = useMutation({
		mutationFn: addRecipe,
		onSuccess: ({id}) => {
			navigate(`/recipe/${id}`);
			alert('recipe added successfully');
		},
		onError: () => alert('failed to add recipe :c ')
	});

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		setRecipe(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const onChangeTagHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		setRecipe((prev) => ({
			...prev,
			tags: e.target.checked ? [...prev.tags, e.target.value] : prev.tags.filter((tag) => tag != e.target.value)
		}))
	}

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		addRecipeMutation.mutate({recipe: recipe, token: user.token});
	};

	if (possibletags.isLoading)
        return (<p>Loading...</p>);

	if (possibletags.isError)
        return (<p>Something went wrong</p>);


	return (
		<div>
			<h2>Add new recipe</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="title">title:</label>
				<input type="text" value={recipe.title} id="title" name="title" onChange={onChangeHandler} required/>
				<label htmlFor="content">content:</label>
				<textarea value={recipe.content} id="content" name="content" onChange={onChangeHandler} rows={10} cols={50} required/>
				<label htmlFor="portions">portions:</label>
				<input type="number" value={recipe.portions} id="portions" name="portions" onChange={onChangeHandler} required/>
				<label>tags:</label>
				<div>
					{possibletags.data.map((tag) => {
							return (<div key={tag.id}>
								<input type="checkbox" value={tag.name} id={tag.id} name="tags" onChange={onChangeTagHandler} checked={recipe.tags.includes(tag.name)}/>
								<label htmlFor={tag.id}>{tag.name}</label>
							</div>)
					})}
				</div>
				
				<button type="submit" disabled={addRecipeMutation.isPending}>
					{addRecipeMutation.isPending ? "Adding Recipe..." : "Add Recipe"}
				</button>
			</form>
		</div>
	);
};
