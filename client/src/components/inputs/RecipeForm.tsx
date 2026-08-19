import type { RecipeData } from "../../DataInterfaces";
import IngredientsInput from "./IngredientsInput";
import TagsInput from "./TagsInput";
import { Stack, TextField } from "@mui/material";

export default function RecipeForm({
	recipe,
	setRecipe,
	handleSubmit
} : {
	recipe : RecipeData,
	setRecipe : (value: React.SetStateAction<RecipeData>) => void,
	handleSubmit : (e: React.SubmitEvent<HTMLFormElement>) => void
}) {

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		setRecipe(prev => ({
			...prev,
			[e.target.id]: e.target.value
		}))
	}

	return (
		<form id='recipeForm' onSubmit={handleSubmit}>
			<Stack
				spacing={2}
				sx={{
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<TextField value={recipe.title} id="title" label="Title" onChange={onChangeHandler} required fullWidth/>
				<IngredientsInput ingredients={recipe.ingredients} setRecipe={setRecipe}/>
				<TextField multiline value={recipe.content} id="content" label="Content" onChange={onChangeHandler} minRows={10} maxRows={50} required fullWidth/>
				<TextField value={recipe.portions} id="portions" label="Portions" onChange={onChangeHandler} required/>
				<TagsInput tags={recipe.tags} setRecipe={setRecipe}/>
			</Stack>
		</form>
	);
};
