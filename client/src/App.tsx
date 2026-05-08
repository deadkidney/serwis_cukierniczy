import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState("");

	const fetchAPI = async () => {
		const response = await fetch("http://localhost:8080/api");
    const data = await response.json();
    setMessage(data.message);
	}

  const fetchUser = async () => {
		const response = await fetch("http://localhost:8080/userinfo?id=1");
    const data = await response.json();
		console.log(data.message);
	}

	useEffect(() => {
		fetchAPI();
	}, []);

  return (
    <section>
          <h1>Get started</h1>
          <p> {message} </p>
          <button onClick={fetchUser}> user </button>
    </section>
  )
}

export default App;
