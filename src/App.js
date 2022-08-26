import "./App.css";
import { useEffect, useState } from "react";

function App() {
    const URL_BASE = "http://localhost:8888/api/v1/";
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const handleSignIn = () => {
        window.open(URL_BASE + "/auth/signin/google", "_self");
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    URL_BASE + "/auth/sessions/checkAuth",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Credentials": true,
                        },
                    }
                );
                const data = await response.json();
                console.log(data);
                if (!data.message) setData(data.data.user);
                else setError(data.message);
            } catch (error) {
                setError(error.message);
            }
        };
        checkAuth();
    }, []);

    console.log(data);

    return (
        <div className="App">
            <button onClick={handleSignIn}>Sign in with Google</button>
            {error && <span>Error: {error}</span>}
            {data && (
            <div>
              <span>{data.displayName}</span>
              <img width={100} src={data.photos[0].value} alt="profile-img"/>
            </div>
            )}
        </div>
    );
}

export default App;
