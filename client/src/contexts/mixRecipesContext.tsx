import { createContext, useState, useContext, type ReactNode } from 'react';

interface RecipesContextType {
  recipesToMix: string[];
  addRecipeToMix: (id: string) => void;
  deleteRecipeToMix: (id: string) => void;
  clearRecipesToMix: () => void
}

const MixRecipesContext = createContext<RecipesContextType>({});

export default function MixRecipesProvider({children} : {children : ReactNode}) {
	const [recipes, setRecipes] = useState<string[]>([]);

	const addRecipeToMix = (id: string) => {
		setRecipes((prev) => [...prev, id]);
	}
	const deleteRecipeToMix = (id: string) => {
		setRecipes((prev) => prev.filter((elem) => elem != id));
	}
	const clearRecipesToMix = () => {
		setRecipes([]);
	}

	return (<MixRecipesContext.Provider value={{recipesToMix: recipes, addRecipeToMix, deleteRecipeToMix, clearRecipesToMix}}>
		{children}
	</MixRecipesContext.Provider>);
}

export const useMixRecipes = () => useContext(MixRecipesContext);