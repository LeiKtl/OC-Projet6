const modal = document.querySelector(".modal");
const modifierBtn = document.querySelector(".modifierBtn");
const token = sessionStorage.getItem("token");
//console.log(token)

// Création des éléments contenu dans la fenêtre modale (titres, icones, etc..), et appel des fonctions pour les evenements au clique
function modalGalleryElements () {
    modal.addEventListener("click", closeModal); //Ferme la modale au clique à l'extérieur
    const modalGallery = document.createElement("div");
    modalGallery.classList.add("modalGallery");
    modalGallery.addEventListener("click", stopPropagation); //Fais en sorte que la modale ne se ferme pas si l'on clique sur la modale de galerie

    const closeIcone = document.createElement("i");
    closeIcone.classList.add("fa-solid", "fa-xmark", "fa-xl", "closeModal");
    closeIcone.addEventListener("click", closeModal); //Ferme la modale au clique sur la croix

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
    addPictureBtn.addEventListener("click", modalAddPicture); //Renvoie sur la seconde modale pour ajouter une photo

    modal.appendChild(modalGallery);
    modalGallery.appendChild(closeIcone);
    modalGallery.appendChild(modalTitle);
    modalGallery.appendChild(miniGallery);
    modalGallery.appendChild(line);
    modalGallery.appendChild(addPictureBtn);
};

// Fonction pour la récupération des projets de la galerie
function recuperationModalGallery () {
    fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(worksGallery => {
        const gallery = document.querySelector(".miniGallery");
        gallery.innerHTML = "";
        for (i = 0 ; i < worksGallery.length ; i++) {
            const figureModal = document.createElement("figure");
            figureModal.classList.add("figureModal")
            figureModal.setAttribute("data-id", worksGallery[i].categoryId);

            const miniImage = document.createElement("img");
            miniImage.classList.add("miniImageGallery");
            miniImage.src = worksGallery[i].imageUrl;
            miniImage.alt = worksGallery[i].title;

            const deleteImage = document.createElement("span");
            deleteImage.classList.add("deleteImageBtn");
            const trashcanIcone = document.createElement("i");
            trashcanIcone.classList.add("fa-solid", "fa-trash-can", "fa-xs");

            deleteImage.addEventListener("click", function () {
            
                console.log(figureModal.dataset.id);
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
                        console.log("ca fonctionne");
                        gallery.innerHTML = "";
                        recuperationModalGallery();
                        mainGallery();
                    } else {
                        console.log("ca ne fonctionne pas");
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

// Fonction pour les éléments de la 2e modale
function modalAddPicture () {
    modal.innerHTML = ""; //Permet d'afficher qu'une modale

    const modalAddPictureForm = document.createElement("div")
    modalAddPictureForm.classList.add("modalAddPictureForm");
    modalAddPictureForm.addEventListener("click", stopPropagation); //Fais en sorte que la modale ne se ferme pas si l'on clique sur la modale de galerie
  
    const arrowLeft = document.createElement("i");
    arrowLeft.classList.add("fa-solid", "fa-arrow-left", "fa-xl", "previousModal");
    arrowLeft.addEventListener("click", generateModalGallery);
    
    const closeIcone = document.createElement("i");
    closeIcone.classList.add("fa-solid", "fa-xmark", "fa-xl", "closeModal");
    closeIcone.addEventListener("click", closeModal);
  
    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Ajouter photo";
    modalTitle.classList.add("modalTitle")
    
    const formModal = document.createElement("div");
  
    const form = document.createElement("form");
    form.action = "#";
    form.method = "post";

    const blocToAddPicture = document.createElement("div");
    blocToAddPicture.classList.add("blocToAddPicture");
  
    const iconeForm = document.createElement("i");
    iconeForm.classList.add("fa-regular", "fa-image", "iconeFormPicture");
  
    const labelAddFile = document.createElement("label");
    labelAddFile.setAttribute("for", "addPicture");
    labelAddFile.textContent = "+ Ajouter une photo";
    labelAddFile.classList.add("AddPictureBtn");
    
    const addFile = document.createElement("input");
    addFile.type = "file";
    addFile.setAttribute("id", "addPicture");
    addFile.name = "addPicture";
    addFile.classList.add("pictureBtnHidden");
  
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
    pictureTitle.classList.add("textAreaForm");
    
    const selectCategoryTitle = document.createElement("label");
    selectCategoryTitle.textContent = "Categorie";
    selectCategoryTitle.setAttribute("for", "categoryName")
    selectCategoryTitle.classList.add("titleFormLabel")

    const selectCategory = document.createElement("select");
    selectCategory.setAttribute("id", "categoryName");
    selectCategory.name = "categoryName";
    pictureTitle.classList.add("textAreaForm");

    //Appel à l'API pour récupérer les catégories et l'ajouter aux options de select dans formulaire
    fetch("http://localhost:5678/api/categories")
    .then(data => data.json())
    .then(categories => {
        categories.forEach((category) => {
            const categoryChoice = document.createElement("option");
            categoryChoice.classList.add("categoryChoice");
            categoryChoice.setAttribute("data-id", category.id);
            categoryChoice.innerText = category.name;
            selectCategory.appendChild(categoryChoice);
        })
    });
  
    const line = document.createElement("hr");
    line.classList.add("formLine");
    
    const submitForm = document.createElement("button");
    submitForm.type = "submit";
    submitForm.textContent = "Valider";
    submitForm.classList.add("submitBtn");
    
    modal.appendChild(modalAddPictureForm);
    modalAddPictureForm.appendChild(arrowLeft);
    modalAddPictureForm.appendChild(closeIcone);
    modalAddPictureForm.appendChild(modalTitle);
    modalAddPictureForm.appendChild(formModal);
    formModal.appendChild(form);
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

//Remet les attribut à leur etat d'origine lorsque la modale est fermer, + enlève les eventListener.
function closeModal () {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", true);
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".closeModal").removeEventListener("click", closeModal);
    modal.querySelector(".modalGallery").removeEventListener("click", stopPropagation);
};

//Fonction qui permet de ne pas fermer la modal
function stopPropagation (event) {
    event.stopPropagation();
};

// Function pour l'apparition de la fenêtre modale, de son contenu et de la galerie
function generateModalGallery () {
    modal.innerHTML = ""; //Nettoie la modale pour ne pas que plusieurs modales s'affichent en même temps
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", true);
    modalGalleryElements();
};

// Evènement au clique sur le bouton modifier de la galerie, appel de la fonction modalGallery qui contient tout le contenu de la modale
modifierBtn.addEventListener("click", function() {
    generateModalGallery();
});