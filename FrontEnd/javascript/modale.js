const modal = document.querySelector(".modal");
const modifierBtn = document.querySelector(".modifierBtn");
const token = localStorage.getItem("token");

// Création des éléments contenu dans la fenêtre modale (titres, icones, etc..), et appel des fonctions pour les evenements au clique
function modalGalleryElements () {
    modal.addEventListener("click", closeModal); //Ferme la modale au clique à l'extérieur
    const modalGallery = document.createElement("div");
    modalGallery.classList.add("modalGallery");
    modalGallery.setAttribute("id", "modalGallery")
    modalGallery.addEventListener("click", stopPropagation);

    modalGallery.innerHTML = /* html */
    `<i class = "fa-solid fa-xmark fa-xl closeModal"></i>
    <h3 class = "modalTitle">Galerie photo</h3>
    <div class = "miniGallery"></div>
    <hr>
    <button class = "addPictureButton">Ajouter une photo</button>
    `;
    
    modalGallery.querySelector(".closeModal").addEventListener("click", closeModal);

    modalGallery.querySelector(".addPictureButton").addEventListener("click", modalAddPicture); //Renvoie sur la seconde modale d'ajout de photo

    modal.appendChild(modalGallery);
    recuperationModalGallery ();
};

// Fonction pour la récupération des projets de la galerie de la modale
function recuperationModalGallery () {
    fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(worksGallery => {
        const gallery = document.querySelector(".miniGallery");
        gallery.innerHTML = "";
        for (i = 0 ; i < worksGallery.length ; i++) {
            const figureModal = document.createElement("figure");
            figureModal.classList.add("figureModal")
            figureModal.setAttribute("data-id", worksGallery[i].id);

            figureModal.innerHTML = /* html */ 
            `<img class = "miniPictureGallery" src = ${worksGallery[i].imageUrl} alt = ${worksGallery[i].title}>
            <span class = "deletePictureBtn">
                <i class = "fa-solid fa-trash-can fa-xs"></i>
            </span>
            `;

            //Evenement au clique sur la corbeille, avec la fonction qui permet de supprimer le projet selectionné
            figureModal.querySelector(".deletePictureBtn").addEventListener("click", function (event) {
                event.preventDefault();
                deletePicture(figureModal);
            });

            gallery.appendChild(figureModal);
        };
    });
};

//Fonction qui permet de supprimer un projet
function deletePicture ( figureModal) {
    const projectId = figureModal.dataset.id;
    fetch("http://localhost:5678/api/works/" + projectId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
        },
    })
    .then(Response => {
        if (Response.ok) {
            recuperationModalGallery();
            mainGallery()
        } else {
            console.log("Une erreur s'est produite, le projet n'a pas été supprimé");
        };
    });
};

// Fonction pour la modale d'ajout d'une photo
function modalAddPicture (event) {
    event.preventDefault();
    modal.innerHTML = ""; //Permet d'afficher qu'une seule modale

    const modalAddPictureForm = document.createElement("div")
    modalAddPictureForm.classList.add("modalAddPictureForm");
    modalAddPictureForm.addEventListener("click", stopPropagation);
    modalAddPictureForm.innerHTML = /* html */ 
    `<i class = "fa-solid fa-arrow-left fa-xl previousModal"></i>
    <i class = "fa-solid fa-xmark fa-xl closeModal"></i>
    <h3 class= "modalTitle">Ajout photo</h3>
    <form class = "formModal">
        <div class = "blocToAddPicture">
            <i class = "fa-regular fa-image  iconeFormPicture"></i>
            <label for = "addPictureFile" class = "addPictureBtn">+ Ajouter une photo</label>
            <input id = "addPictureFile" type = "file"  name = "addPictureFile" class = "pictureBtnHidden addFile" accept = ".jpg, .png" required>
            <p class = "formatIndication">jpg, png : 4mo max</p>
        </div>
        <label for = "pictureTitle" class = "titleFormLabel">Titre</label>
        <input type = "text" id = "pictureTitle" name = "pictureTitle" class = "pictureTitle" required>
        <label for = "categoryName" class = "titleFormLabel">Catégorie</label>
        <select id = "categoryName" name = "categoryName" class = "categoryName" required>
            <option class = "blankChoiceCategory"></option>
        </select>
        <hr class = "formLine">
        <button type = "submit" class = "submitBtn btnDisabled">Valider</button>
    </form>
    `;
    modalAddPictureForm.querySelector(".previousModal").addEventListener("click", generateModalGallery); //Retour modale précèdente
    modalAddPictureForm.querySelector(".closeModal").addEventListener("click", closeModal); //Ferme la modale
    modalAddPictureForm.querySelector(".addFile").addEventListener("change", picturePreview); ///Affiche l'image sélectionnée dans le formulaire


    categoriesOptions(modalAddPictureForm);

    const formModal = modalAddPictureForm.querySelector(".formModal");
    const pictureTitle = modalAddPictureForm.querySelector(".pictureTitle");
    const addFile = modalAddPictureForm.querySelector(".addFile");
    const categoryName = modalAddPictureForm.querySelector(".categoryName");
    const submitForm = modalAddPictureForm.querySelector(".submitBtn");

    verifyInputForm(formModal, addFile, pictureTitle, categoryName, submitForm);//Vérifie que les champs sont bien remplis
    sendNewProject(formModal, pictureTitle,addFile,categoryName);//Envoie un nouveau projet

    modal.appendChild(modalAddPictureForm);
};

function categoriesOptions(modalAddPictureForm) {
    //Appel à l'API pour récupérer les catégories et l'ajouter aux options de select dans le formulaire
    fetch("http://localhost:5678/api/categories")
    .then(data => data.json())
    .then(categories => {
        categories.forEach((category) => {
            const categoryChoice = document.createElement("option");
            categoryChoice.classList.add("categoryChoice");
            categoryChoice.setAttribute("value", category.id);
            categoryChoice.innerText = category.name;
            modalAddPictureForm.querySelector(".categoryName").appendChild(categoryChoice);
        });
    });
};


//Fonction qui permet d'afficher l'image sélectionnée dans le formulaire
function picturePreview() {
    const blocToAddPicture = document.querySelector(".blocToAddPicture");
    blocToAddPicture.innerHTML = "";

    blocToAddPicture.innerHTML = /* html */
    `<label for = "addPictureFile" class = "labelPicturePreview">
        <img class = "formPicturePreview">
    </label>
    <input id = "addPictureFile" type = "file"  name = "addPictureFile" class = "pictureBtnHidden addFile" accept = ".jpg, .png">
    `;

    const formPicturePreview = document.querySelector(".formPicturePreview");
    formPicturePreview.src = URL.createObjectURL(this.files[0]); //Créer une URL à l'image sélectionnée et permet de l'afficher

    const pictureTitle = document.querySelector(".pictureTitle");
    formPicturePreview.alt = pictureTitle.value;

    const addFile = document.querySelector(".addFile");
    addFile.addEventListener("change", picturePreview);
};

function verifyInputForm(formModal, addFile, pictureTitle, categoryName, submitForm) {
    //Vérifie que tous les champs sont remplis, si c'est le cas change l'aspect du bouton d'envoie du formulaire, sinon il reste non cliquable
    formModal.addEventListener("change", function() {
        if (addFile.files[0] && pictureTitle.value != "" && categoryName.value != "") {
            submitForm.disabled = false;
            submitForm.classList.remove("btnDisabled");
        } else { 
            submitForm.disabled = true;
            submitForm.classList.add("btnDisabled");
        }
    });
};

//Fonction pour l'ajout du projet avec appel à l'API
function sendNewProject(formModal, pictureTitle, addFile, categoryName) {

    formModal.addEventListener("submit", function (event) {
        event.preventDefault();
        
       const formData = new FormData();
       formData.append("title", pictureTitle.value);
       formData.append("image", addFile.files[0]);
       formData.append("category", categoryName.value);

       fetch("http://localhost:5678/api/works", {
           method : "POST",
           headers: {
               "Authorization": `Bearer ${token}`,
               "Accept" : "application/json",
           },
           body : formData,
       })
       .then (Response => {
           if (Response.ok) {
               Response.json();
               mainGallery();
               modal.innerHTML = "";
               modalGalleryElements(); //redirige vers la modale de la galerie avec le nouveau projet
           } else {
               console.error("Un problème est survenu, l'image n'a pas pu être ajoutée");
           };
       });
   });
};

//Remet les attribut à leur etat d'origine lorsque la modale est fermer, + enlève les eventListener; + ferme la modale lors du clique sur la croix
function closeModal (event) {
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", true);
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".closeModal").removeEventListener("click", closeModal);
};

//Fonction qui permet de ne pas fermer la modal ouverte lorsque l'on clique dessus
function stopPropagation (event) {
    event.stopPropagation();
};

// Function pour l'apparition de la fenêtre modale et de la galerie
function generateModalGallery (event) {
    event.preventDefault();
    modal.innerHTML = ""; //Nettoie la modale pour ne pas que plusieurs modales s'affichent en même temps
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", true);
    modalGalleryElements(event);
};

// Evènement au clique sur le bouton modifier de la galerie, appel de la fonction modalGallery qui contient tout le contenu de la modale
modifierBtn.addEventListener("click", generateModalGallery);