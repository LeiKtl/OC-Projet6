const modal = document.querySelector(".modal");
const modifierBtn = document.querySelector(".modifierBtn");
const token = localStorage.getItem("token");

/**
 * @description Creation of the elements contained in the modal window and call of functions for click events
 */
function modalGalleryElements () {
    modal.addEventListener("click", closeModal);
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

    modalGallery.querySelector(".addPictureButton").addEventListener("click", modalAddPicture);

    modal.appendChild(modalGallery);
    recuperationModalGallery ();
};

/**
 * @description Fonction that retrieves projects to display them in the modal gallery and allows you to delete a project with click event
 */
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

            figureModal.querySelector(".deletePictureBtn").addEventListener("click", function (event) {
                event.preventDefault();
                deletePicture(figureModal);
            });

            gallery.appendChild(figureModal);
        };
    });
};

/**
 * @description Function that allows to delete the selected project
 * @param {*} figureModal - Name of the variable of the figure within the modal gallery that contains the id's project
 */
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

/**
 * @description Function that create the modal adding photo and allows you to display only one modal
 * @param {*} event - To handle the default event
 */
function modalAddPicture (event) {
    event.preventDefault();
    modal.innerHTML = "";

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
    modalAddPictureForm.querySelector(".previousModal").addEventListener("click", generateModalGallery);
    modalAddPictureForm.querySelector(".closeModal").addEventListener("click", closeModal);
    modalAddPictureForm.querySelector(".addFile").addEventListener("change", picturePreview);


    categoriesOptions(modalAddPictureForm);

    const formModal = modalAddPictureForm.querySelector(".formModal");
    const pictureTitle = modalAddPictureForm.querySelector(".pictureTitle");
    const addFile = modalAddPictureForm.querySelector(".addFile");
    const categoryName = modalAddPictureForm.querySelector(".categoryName");
    const submitForm = modalAddPictureForm.querySelector(".submitBtn");

    verifyInputForm(formModal, addFile, pictureTitle, categoryName, submitForm);
    sendNewProject(formModal, pictureTitle,addFile,categoryName);

    modal.appendChild(modalAddPictureForm);
};

/**
 * @description Call to the API to retrieve the categories and add them to the select options in the form
 * @param {*} modalAddPictureForm 
 */
function categoriesOptions(modalAddPictureForm) {
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

/**
 * @description Function that displays the selected image in the form and create an URL for this image
 */
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
    formPicturePreview.src = URL.createObjectURL(this.files[0]); 

    const pictureTitle = document.querySelector(".pictureTitle");
    formPicturePreview.alt = pictureTitle.value;

    const addFile = document.querySelector(".addFile");
    addFile.addEventListener("change", picturePreview);
};

/**
 * @description Checks that all fields are filled, if this is the case changes the appearance of the form's submit button, otherwise it remains unclickable
 * @param {*} formModal - Name of the variable to add the event "change"
 * @param {*} addFile - Name of the variable that contains the <input type="file">
 * @param {*} pictureTitle - Name of the variable that contains the name of the picture
 * @param {*} categoryName - Name of the variable that contains the <select> for categories
 * @param {*} submitForm  - Name of the variable that contains the submit button of the adding picture form
 */
function verifyInputForm(formModal, addFile, pictureTitle, categoryName, submitForm) {
    formModal.addEventListener("change", function() {
        if (addFile.files[0] && pictureTitle.value != "" && categoryName.value != "") {
            submitForm.classList.remove("btnDisabled");
        } else { 
            submitForm.classList.add("btnDisabled");
        };
    });
};

/**
 * @description Function for adding a new project, with call to the API and redirects to the gallery modal with the new project after submit
 * @param {*} formModal - Name of the variable to add the event "submit"
 * @param {*} pictureTitle - Name of the variable that contains the name of the picture
 * @param {*} addFile - Name of the variable that contains the <input type="file">
 * @param {*} categoryName - Name of the variable that contains the <select> for categories
 */
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
               modalGalleryElements();
           } else {
               console.error("Un problème est survenu, l'image n'a pas pu être ajoutée");
           };
       });
   });
};

/**
 * @description Function that close the modal and return attributes to their original state when the modal is closed, and removes click events
 * @param {*} event - to handle the default event
 */
function closeModal (event) {
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", true);
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".closeModal").removeEventListener("click", closeModal);
};

/**
 * @description Function that allows you to not close the open modal window when you click on it
 * @param {*} event - to handle the default event
 */
function stopPropagation (event) {
    event.stopPropagation();
};

/**
 * @description Function for appearance of modal window (gallery modal) and clean the modal so that several modals are not displayed at the same time
 * @param {*} event - to handle the default event
 */
function generateModalGallery (event) {
    event.preventDefault();
    modal.innerHTML = "";
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", true);
    modalGalleryElements(event);
};

/**
 * @description Event when clicking on the modify button of the main gallery: call of the modalGallery function which contains all the content of the modal window
 */
modifierBtn.addEventListener("click", generateModalGallery);