import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './routes/Home';
import Recipe from './routes/Recipe';
import EditRecipeForm from './routes/EditRecipeForm';
import AddRecipeForm from './routes/AddRecipeForm';
import User from './routes/User';
import CommentList from './routes/CommentList';
import LoginForm from './routes/LoginForm';

export default function App() {
	return (
		<div>
			<Header/>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/recipe/:id" element={<Recipe />} />
				<Route path="/comments/recipe/:id" element={<CommentList />} />
				<Route path="/edit/recipe/:id" element={<EditRecipeForm />} />
				<Route path="/newrecipe" element={<AddRecipeForm />} />
				<Route path="/login" element={<LoginForm/>}/>
				<Route path="/user/:id" element={<User />} />
				<Route path="*" element={<Navigate to="/" />}/>
			</Routes>
		</div>
	)
}
