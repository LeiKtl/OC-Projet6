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
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(userIdentifier) //Converti en une chaîne de caractère au format JSON
        })
        .then (response => {
            if (response.ok) {
            const identifiers = response.json();
            localStorage.setItem("token", identifiers.token); //enregistrer le token dans le localStorage
            window.location.href = "./index.html"; //redirige vers la page d'accueil en étant connecté
            } else {
                //Affiche un message d'erreur dans le formulaire, lorsque l'identifiant et/ou le mot de passe n'est pas le bon
                errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
                errorMessage.classList.add("error");
            }
        });   
    });
};
logIn ();