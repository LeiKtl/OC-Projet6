/**
 * @description When the user is connected change the "login" button in "logout", allows him to disconnect by clicking on it and adds edit mode elements
 */
function editionMode() {
    const editionMode = /** @type {HTMLElement} */ (document.querySelector(".editionMode"));
    editionMode.style.display = "flex";

    const editionGallery = /** @type {HTMLElement} */ (document.querySelector(".editionGallery"));
    editionGallery.style.marginBottom = "80px";

    const modifierBtn = /** @type {HTMLElement} */ (document.querySelector(".modifierBtn"));
    modifierBtn.style.display = "block";

    const filters = /** @type {HTMLElement} */ (document.querySelector(".filters"));
    filters.style.display = "none";
        
    const btnLog = document.querySelector(".btnLog");
    btnLog.innerHTML = "logout";

    btnLog.addEventListener("click", function () {
        localStorage.removeItem("token");
    });
};

/**
 * @description Function that retrieves the architect's work
 */
function mainGallery(){
    fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(works => {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        for (let i = 0 ; i < works.length ; i++) {
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

/**
 * @description Function to create the button filters of the gallery and manage the appearance of images in the gallery according to the chosen filter
 */
function filters() {
    fetch("http://localhost:5678/api/categories")
    .then(data => data.json())
    .then(categories => {
        
        const filters = document.querySelector(".filters");
        const btnAll = document.createElement("button");
        btnAll.classList.add("filtersBtn", "filtersBtnSelected");
        btnAll.innerText = "Tous";
        btnAll.setAttribute("data-id", "0");
        filters.appendChild(btnAll);
        
        categories.forEach((category) => {
            const btnCategory = document.createElement("button");
            btnCategory.classList.add("filtersBtn");
            btnCategory.setAttribute("data-id", category.id);
            btnCategory.innerText = category.name;
            filters.appendChild(btnCategory)
        })

        buttonSelected();
    })
    .catch(error => {
        console.error("Un problème est survenu lors de la récupération des données:", error);
    });
};

/**
 * @description Click event on the category buttons that retrieves works from the gallery and add a condition for displaying works according to the selected button
 */
function buttonSelected() {
    const allBtn = document.querySelectorAll("button")
    allBtn.forEach((buttons) => {
        buttons.addEventListener("click", function() {
            
            const btnDisabled = document.querySelector(".filtersBtnSelected");
            btnDisabled.classList.remove("filtersBtnSelected");
            buttons.classList.add("filtersBtnSelected")

            const allFigures = document.querySelectorAll("figure")
            allFigures.forEach((figure) => {
                if (figure.dataset.id === buttons.dataset.id || buttons.dataset.id === "0" || figure.dataset.id === "0") {
                    figure.style.display = "block";
                } else {
                    figure.style.display = "none";
                }
            });
        });
    });
};

/**
 * @description manage the appearence of the website on whether the user is logged in or not 
 */
function connected () {
    const userConnected = localStorage.getItem("token");
    if (userConnected) {
        editionMode ();
        mainGallery ();
    } else {
        filters ();
        mainGallery ();
    }
};
connected ();