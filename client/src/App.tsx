import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './routes/Home';
import Recipe from './routes/Recipe';
import AddRecipeForm from './routes/AddRecipeForm';
import User from './routes/User';

export default function App() {
	return (
		<div>
			<Header/>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="recipe/:id" element={<Recipe />} />
				<Route path="newrecipe" element={<AddRecipeForm />} />
				<Route path="user/:id" element={<User />} />
				<Route path="*" element={<Navigate to="/" />}/>
			</Routes>
		</div>
	)
}
