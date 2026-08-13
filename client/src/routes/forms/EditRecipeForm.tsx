import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipeById, updateRecipe } from "../../utils/recipeQueries";
import { useAuth } from "../../authContext";
import type { RecipeData } from "../../DataInterfaces";
import { getTags } from "../../utils/otherQueries";

export default function EditRecipeForm () {
	const {id} = useParams();
	if (!id) throw Error("no recipe id");

	const {user} = useAuth();

	let navigate = useNavigate();

	const {data, isLoading, isError} = useQuery({
		queryKey: ['recipe', {id: id}],
        queryFn: () => getRecipeById(id),
		retry: 1
	})

	const possibletags = useQuery({
			queryKey: ['tags'],
			queryFn: () => getTags(),
			retry: 1,
			staleTime: 60000
		})
	
	const [recipe, setRecipe] = useState<RecipeData>({
			id: data ? data.id : "",
			title: (data && data.title) ? data.title : "",
			user_id: (data && data.user_id) ? data.user_id : "",
			content: (data && data.content) ? data.content : "",
			portions: (data && data.portions) ? data.portions : 1,
			tags: (data && data.tags) ? data.tags : [],
			accepted: false
	});
	
	if (isLoading || possibletags.isLoading)
        return (<p>Loading...</p>);

	if (isError || possibletags.isError)
        return (<p>Couldn't find the recipe</p>);

	if (!user || user.id != data.user_id)
		return (<p>You can't edit this recipe</p>);
	
	const updateRecipeMutation = useMutation({
		mutationFn: updateRecipe,
		onSuccess: () => {
			navigate(`/recipe/${id}`);
			alert('recipe updated successfully');
		},
		onError: () => alert('failed to update recipe :c ')
	});

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		setRecipe(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const onChangeTagHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		setRecipe(prev => ({
			...prev,
			tags: e.target.checked ? [...prev.tags, e.target.value] : prev.tags.filter((tag) => tag != e.target.value)
		}))
	}

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateRecipeMutation.mutate({recipe: recipe, token: user.token});
	};

	return (
		<div>
			<h2>Edit recipe</h2>
			<p>After you edit the recipe you'll have to wait for admin to accept it again.</p>
			<form onSubmit={handleSubmit}>
				<label htmlFor="title">title:</label>
				<input type="text" value={recipe.title} id="title" name="title" onChange={onChangeHandler} />
				<label htmlFor="content">content:</label>
				<textarea value={recipe.content} id="content" name="content" onChange={onChangeHandler} rows={10} cols={50} />
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

				<button type="submit" disabled={updateRecipeMutation.isPending}>
					{updateRecipeMutation.isPending ? "Updating Recipe..." : "Update Recipe"}
				</button>
			</form>
		</div>
	);
};
