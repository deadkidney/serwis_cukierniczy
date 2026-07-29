import { Link } from "react-router-dom";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const {user, deleteUserData} = useAuth();
    const navigate = useNavigate();

    const logout = async (e) => {
      e.preventDefault();
      deleteUserData();
      navigate('/');
   };

    return(
        <section>
            <h1>Przepisy!!</h1>
            <Link to='/'>main </Link>
            <Link to='/newrecipe'> Create new recipe </Link>
            {user? <button onClick={logout}>Log out</button> : <Link to='/login'>Log in</Link>}
            {user && <p>{user.username}</p>}
        </section>
        
    );
}