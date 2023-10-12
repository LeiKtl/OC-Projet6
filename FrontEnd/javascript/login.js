/**
 * @description API request to send and retrieve the user identifiers entered in the form, with click event on submit button and prevent default event that resets page 
 */
function logIn () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); 
        
        const emailValue = document.getElementById("email").value;
        const passwordValue = document.getElementById("password").value;
        const errorMessage = document.querySelector(".errorMessage");

        const userIdentifier = {
            email: emailValue,
            password: passwordValue,
        };
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(userIdentifier)
        })
        .then (response => response.json())
        .then (identifiers => {
            if (identifiers.token) {
                localStorage.setItem("token", identifiers.token);
                window.location.href = "./index.html";
            } else {
                errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
                errorMessage.classList.add("error");
            }
        });
    });
};
logIn ();