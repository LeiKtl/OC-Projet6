//Requête API afin d'envoyer et récupérer les identifiants utilisateur inscrit dans le formulaire
function logIn () {
    const loginForm = document.querySelector("form");

    //Evenement au clique sur le bouton "se connecter" du formulaire de connexion
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); //Empêche l'évènement par default qui est de réinitialiser la page
        
        const emailValue = document.getElementById("email").value;
        const passwordValue = document.getElementById("password").value;
        const errorMessage = document.querySelector(".errorMessage");

        const userIdentifier = {
            email: emailValue, //récupère la valeur entrée dans le formulaire
            password: passwordValue, //récupère la valeur entrée dans le formulaire
        };
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(userIdentifier) //Converti en une chaîne de caractère au format JSON
        })
        .then (response => response.json())
        .then (identifiers => {
            if (identifiers.token) {
                sessionStorage.setItem("token", identifiers.token);//Enregistre le token dans le local storage
                window.location.href = "./index.html"; //Redirige vers la page d'accueil
            } else {
                errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
                errorMessage.classList.add("error");
            }
        });
    });
};
logIn ();