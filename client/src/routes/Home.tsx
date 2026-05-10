import { useState, useEffect } from 'react'
import type { RecipeData } from '../DataInterfaces';
import RecipeTable from '../components/RecipeTable';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState<RecipeData[]>([]);

    const fetchRecipes = async () => {
        try {
            const response = await fetch("http://localhost:8080/recipes");
            if (!response.ok) {
                    throw new Error(`${response.status}`)
            }
            const data = await response.json();
            setRecipes(data.recipes);
            setLoading(false);
        } catch (error) {
			console.error(error);
		}
    }

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <section>
            {loading ? <p>Loading...</p> : <RecipeTable recipes={recipes}/>}
        </section>
    )
}
