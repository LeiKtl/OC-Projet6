//Fonction qui lorsque l'utilisateur est connecté change le bouton "login" en "logout", et lui permet de se deconnecter en cliquant dessus + ajout des éléments du mode édition
function connected () {
    const userConnected = localStorage.getItem("token");
    if (userConnected) {
        const editionMode = document.querySelector(".editionMode");
        editionMode.style.display = "flex";

        const editionGallery = document.querySelector(".editionGallery");
        editionGallery.style.marginBottom = "80px";

        const modifierBtn = document.querySelector(".modifierBtn");
        modifierBtn.style.display = "block";

        const filters = document.querySelector(".filters");
        filters.style.display = "none"
        
        const btnLog = document.querySelector(".btnLog");
        btnLog.innerHTML = "logout";
        btnLog.addEventListener("click", function () {
            localStorage.removeItem("token");
        })
    }
};
connected ();

//Création de la fonction qui récupère les travaux de l'architecte
function mainGallery(){
    fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(works => {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        for (i = 0 ; i < works.length ; i++) {
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", works[i].categoryId);

            const image = document.createElement("img");
            image.src = works[i].imageUrl;
            image.alt = works[i].title;
        
            const figCaption = document.createElement("figcaption");
            figCaption.innerText = works[i].title;
        
            figure.appendChild(image);
            figure.appendChild(figCaption);
            gallery.appendChild(figure);
        }
    })  
    .catch(error => {
        console.error("Un problème est survenu lors de la récupération des données:", error);
    });
};
mainGallery();

// Création de la fonction pour gérer la galerie selon le bouton categorie selectionné
function filters() {
    fetch("http://localhost:5678/api/categories")
    .then(data => data.json())
    .then(categories => {
        //Création du bouton "tous"
        const filters = document.querySelector(".filters");
        const btnAll = document.createElement("button");
        btnAll.classList.add("filtersBtn", "filtersBtnSelected");
        btnAll.innerText = "Tous";
        btnAll.setAttribute("data-id", "0");
        filters.appendChild(btnAll);
        
        //Création des autres boutons de catégorie récupérés dans l'API
        categories.forEach((category) => {
            const btnCategory = document.createElement("button");
            btnCategory.classList.add("filtersBtn");
            btnCategory.setAttribute("data-id", category.id);
            btnCategory.innerText = category.name;
            filters.appendChild(btnCategory)
        })

        //Ajout de l'évènement au clique des boutons
        const allBtn = document.querySelectorAll("button")
        allBtn.forEach((buttons) => {
            buttons.addEventListener("click", function() {
                //Ajout du CSS du bouton selectionné
                const btnDisabled = document.querySelector(".filtersBtnSelected");
                btnDisabled.classList.remove("filtersBtnSelected");
                buttons.classList.add("filtersBtnSelected")

                //Récupération des travaux de la galerie (<figure>) et ajout d'une condition pour l'affichage des travaux selon le bouton selectionné
                const allFigures = document.querySelectorAll("figure")
                allFigures.forEach((figure) => {
                    if (figure.dataset.id === buttons.dataset.id || buttons.dataset.id === "0" || figure.dataset.id === "0") {
                        figure.style.display = "block";
                    } else {
                        figure.style.display = "none";
                    }
                })
            })
        })   
    })
    .catch(error => {
        console.error("Un problème est survenu lors de la récupération des données:", error);
    });
};
filters();