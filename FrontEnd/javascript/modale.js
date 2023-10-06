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

    const closeIcone = document.createElement("i");
    closeIcone.classList.add("fa-solid", "fa-xmark", "fa-xl", "closeModal");
    closeIcone.addEventListener("click", closeModal);

    const modalTitle = document.createElement("h3");
    modalTitle.classList.add("modalTitle");
    modalTitle.textContent = "Galerie photo"; 

    const miniGallery = document.createElement("div");
    miniGallery.classList.add("miniGallery");

    recuperationModalGallery ();

    const line = document.createElement("hr");

    const addPictureBtn = document.createElement("button");
    addPictureBtn.classList.add("addPictureButton");
    addPictureBtn.textContent = "Ajouter une photo";
    addPictureBtn.addEventListener("click", modalAddPicture); //Renvoie sur la seconde modale d'ajout de photo

    modal.appendChild(modalGallery);
    modalGallery.appendChild(closeIcone);
    modalGallery.appendChild(modalTitle);
    modalGallery.appendChild(miniGallery);
    modalGallery.appendChild(line);
    modalGallery.appendChild(addPictureBtn);
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

            const miniImage = document.createElement("img");
            miniImage.classList.add("miniImageGallery");
            miniImage.src = worksGallery[i].imageUrl;
            miniImage.alt = worksGallery[i].title;

            const deleteImage = document.createElement("span");
            deleteImage.classList.add("deleteImageBtn");
            const trashcanIcone = document.createElement("i");
            trashcanIcone.classList.add("fa-solid", "fa-trash-can", "fa-xs");

            //Evenement au clique sur la corbeille, avec la fonction qui permet de supprimer le projet selectionné
            deleteImage.addEventListener("click", function (event) {
                //console.log(figureModal.dataset.id);
                event.preventDefault();
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
                        //console.log("ca fonctionne");
                        recuperationModalGallery();
                        mainGallery();
                    } else {
                        console.log("Une erreur s'est produite, le projet n'a pas été supprimé");
                    };
                });
            });
        
            deleteImage.appendChild(trashcanIcone)
            figureModal.appendChild(miniImage);
            figureModal.appendChild(deleteImage);
            gallery.appendChild(figureModal);
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
  
    const arrowLeft = document.createElement("i");
    arrowLeft.classList.add("fa-solid", "fa-arrow-left", "fa-xl", "previousModal");
    arrowLeft.addEventListener("click", generateModalGallery);
    
    const closeIcone = document.createElement("i");
    closeIcone.classList.add("fa-solid", "fa-xmark", "fa-xl", "closeModal");
    closeIcone.addEventListener("click", closeModal);
  
    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Ajout photo";
    modalTitle.classList.add("modalTitle")
  
    //Ajout du formulaire
    const form = document.createElement("form");

   //Bloc qui contient les éléments d'ajout de l'image
    const blocToAddPicture = document.createElement("div");
    blocToAddPicture.classList.add("blocToAddPicture");
  
    const iconeForm = document.createElement("i");
    iconeForm.classList.add("fa-regular", "fa-image", "iconeFormPicture");
  
    //Ajout de l'élément pour selectionner l'image à ajouter
    const labelAddFile = document.createElement("label");
    labelAddFile.setAttribute("for", "addPictureFile");
    labelAddFile.textContent = "+ Ajouter une photo";
    labelAddFile.classList.add("addPictureBtn");
    
    const addFile = document.createElement("input");
    addFile.type = "file";
    addFile.accept = ".jpg, .png";
    addFile.setAttribute("id", "addPictureFile");
    addFile.name = "addPicture";
    addFile.classList.add("pictureBtnHidden");
    addFile.required = true;

    //Fonction qui affiche l'image sélectionnée dans le formulaire
    addFile.addEventListener("change", function () {
        //Relie l'image au label de l'input pour rendre l'image sélectionnée cliquable, ce qui permet d'en choisir une autre
        const labelPicturePreview = document.createElement("label");
        const formPicturePreview = document.createElement("img");
        formPicturePreview.classList.add("formPicturePreview");
        formPicturePreview.src = URL.createObjectURL(this.files[0]); //Créer une URL à l'image sélectionnée et permet de l'afficher
        formPicturePreview.alt = pictureTitle.value;
        labelPicturePreview.setAttribute("for", "addPictureFile");
        labelPicturePreview.classList.add("labelPicturePreview");

        blocToAddPicture.appendChild(labelPicturePreview);
        labelPicturePreview.appendChild(formPicturePreview)

        
        labelAddFile.style.display = "none";
        iconeForm.style.display = "none";
        formatIndication.style.display = "none";
    });
  
    const formatIndication =  document.createElement("p");
    formatIndication.textContent = "jpg, png : 4mo max";
    formatIndication.classList.add("formatIndication");

    //Ajout de l'élément pour ajouter le titre de la photo
    const labelPictureTitle = document.createElement("label");
    labelPictureTitle.setAttribute("for", "pictureTitle");
    labelPictureTitle.textContent = "Titre";
    labelPictureTitle.classList.add("titleFormLabel");
  
    const pictureTitle = document.createElement("input");
    pictureTitle.type = "text";
    pictureTitle.setAttribute("id", "pictureTitle");
    pictureTitle.name = "pictureTitle";
    pictureTitle.required = true;
    
    //Ajout de l'élément pour la sélection de la catégorie de la photo
    const selectCategoryTitle = document.createElement("label");
    selectCategoryTitle.textContent = "Categorie";
    selectCategoryTitle.setAttribute("for", "categoryName")
    selectCategoryTitle.classList.add("titleFormLabel")

    const selectCategory = document.createElement("select");
    selectCategory.setAttribute("id", "categoryName");
    selectCategory.name = "categoryName";
    selectCategory.required = true;

    const blankChoiceCategory = document.createElement("option");
    selectCategory.appendChild(blankChoiceCategory);

    //Appel à l'API pour récupérer les catégories et l'ajouter aux options de select dans le formulaire
    fetch("http://localhost:5678/api/categories")
    .then(data => data.json())
    .then(categories => {
        categories.forEach((category) => {
            const categoryChoice = document.createElement("option");
            categoryChoice.classList.add("categoryChoice");
            categoryChoice.setAttribute("value", category.id);
            categoryChoice.innerText = category.name;
            selectCategory.appendChild(categoryChoice);
        })
    });
  
    const line = document.createElement("hr");
    line.classList.add("formLine");
    
    const submitForm = document.createElement("button");
    submitForm.type = "submit";
    submitForm.textContent = "Valider";
    submitForm.classList.add("submitBtn", "btnDisabled");

    //Vérifie que tous les champs sont remplis, si c'est le cas change l'aspect du bouton d'envoie du formulaire, sinon il reste non cliquable
    form.addEventListener("change", function() {
        if (addFile.files[0] && pictureTitle.value != "" && selectCategory != "") {
            submitForm.disabled = false;
            submitForm.classList.remove("btnDisabled");
        } else { 
            submitForm.disabled = true;
            submitForm.classList.add("btnDisabled");
        }
    });

    //Envoie du formulaire pour l'ajout du projet avec appel à l'API
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData();

        formData.append("title", pictureTitle.value);
        formData.append("image", addFile.files[0]);
        formData.append("category", selectCategory.value);

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

    
    modal.appendChild(modalAddPictureForm);
    modalAddPictureForm.appendChild(arrowLeft);
    modalAddPictureForm.appendChild(closeIcone);
    modalAddPictureForm.appendChild(modalTitle);
    modalAddPictureForm.appendChild(form);
    form.appendChild(blocToAddPicture);
    blocToAddPicture.appendChild(iconeForm);
    blocToAddPicture.appendChild(labelAddFile);
    blocToAddPicture.appendChild(addFile);
    blocToAddPicture.appendChild(formatIndication);
    form.appendChild(labelPictureTitle);
    form.appendChild(pictureTitle);
    form.appendChild(selectCategoryTitle);
    form.appendChild(selectCategory);
    form.appendChild(line);
    form.appendChild(submitForm);
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