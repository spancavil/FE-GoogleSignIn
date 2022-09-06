import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const URL_BASE = "http://localhost:8888/api/v1/";
    const GOOGLE_CLIENT_ID =
        "989227771619-nifl5ep09cfqo06ncsrj46k4r2p10gkc.apps.googleusercontent.com";

    const [google, setGoogle] = useState(window.google);
    /* const handleSignIn = () => {
        window.open(URL_BASE + "/auth/signin/google", "_self");
    }; */

    /* useEffect(() => {
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
    }, []); */

    async function handleCredentialResponse(response) {
        try {
            console.log("Encoded JWT ID token: " + response.credential);
            console.log(response);
            const serverResponse = await axios.post(
                URL_BASE + "auth/signin/google",
                { token: response.credential }
            );
            console.log(serverResponse);
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    useEffect(() => {
        if (google) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });
            google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" } // customization attributes
            );
            // google.accounts.id.prompt(); // also display the One Tap dialog
        }
    }, [google]);

    return (
        <div className="App">
            <div id="buttonDiv"></div>
        </div>
    );
}

export default App;
