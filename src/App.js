import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

    const URL_BASE = "https://grandest-dev.herokuapp.com/api/v1";
    const GOOGLE_CLIENT_ID =
        "989227771619-nifl5ep09cfqo06ncsrj46k4r2p10gkc.apps.googleusercontent.com";
    const FACEBOOK_API_ID = "3279377942379915";

    const [google] = useState(window.google);
    const [apple] = useState(window.AppleID);
    const [facebook] = useState(window.FB);

    //Initialize API's effect
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
        if (facebook) {
            facebook.init({
                appId: FACEBOOK_API_ID,
                cookie: false, // Enable cookies to allow the server to access the session.
                xfbml: false, // Parse social plugins on this webpage.
                version: "v14.0", // Use this Graph API version for this call.
            });
        }
    }, [google, apple, facebook]);

    //Handle token
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

    const handleFacebookLogin = () => {
        console.log("Entra aqui");
        window.FB.login(
            (response) => {
                console.log("Entra response");
                //El access token está en authResponse.accessToken
                console.log(response);
                //Traemos información;

                //Pegamos en signin del backend
                /* const serverResponse = await axios.post(
                    URL_BASE + "auth/signin/facebook",
                    { token: response.credential }
                );
                console.log(serverResponse); */
            },
            {scope: 'public_profile,email'}
        );
        //La información del usuario está en en FB.api. NOTA: no traer información del usuario, lo hacemos desde el back. Solo pegar el accessToken
        /* window.FB.api(
            "/me",
            (data) => {
                console.log("Entra a data");
                console.log(data);
            }
        ); */
    };

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
            <button onClick={handleFacebookLogin}>Facebook login</button>
        </div>
    );
}

export default App;
