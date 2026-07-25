import { Link } from "react-router-dom";

export default function Header() {
    return(
        <section>
            <h1>Przepisy!!</h1>
            <Link to="/">main </Link>
            <Link to='/newrecipe'> Create new recipe </Link>
        </section>
        
    );
}