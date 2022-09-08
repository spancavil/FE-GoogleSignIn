import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const URL_BASE = "https://grandest-fe.herokuapp.com/api/v1/";
    const GOOGLE_CLIENT_ID =
        "989227771619-nifl5ep09cfqo06ncsrj46k4r2p10gkc.apps.googleusercontent.com";

    const [google] = useState(window.google);
    const [apple] = useState(window.AppleID);
    const [facebook, setFacebook] = useState(window.FB);
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

    async function handleGoogleCredential(response) {
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
                callback: handleGoogleCredential,
            });
            google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" } // customization attributes
            );
            // google.accounts.id.prompt(); // also display the One Tap dialog
        }
        if (apple) {
            apple.auth.init({
                clientId: "[CLIENT_ID]",
                scope: "[SCOPES]",
                redirectURI: "[REDIRECT_URI]",
                state: "[STATE]",
                nonce: "[NONCE]",
                usePopup: true,
            });
        }

    }, [google, apple]);

    const handleFB = () => {
        facebook.login(response => {
            console.log(response);
        })
    }

    //Listeners for apple data
    useEffect(() => {
        document.addEventListener("AppleIDSignInOnSuccess", (event) => {
            // Handle successful response.
            console.log(event.detail.data);
        });

        // Listen for authorization failures.
        document.addEventListener("AppleIDSignInOnFailure", (event) => {
            // Handle error.
            console.log(event.detail.error);
        });
    }, []);

    return (
        <div className="App">
            <div id="buttonDiv"></div>
            <div
                id="appleid-signin"
                data-color="black"
                data-border="true"
                data-type="sign in"
            ></div>
            <button onClick={handleFB}>Facebook login</button>
        </div>
    );
}

export default App;
