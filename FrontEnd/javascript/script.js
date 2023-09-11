//Création de la fonction qui récupère les travaux de l'architecte
function mainGallery(){
    fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(galleryPictures => {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        for (i = 0 ; i < galleryPictures.length ; i++) {
            const figure = document.createElement("figure");
        
            const image = document.createElement("img");
            image.src = galleryPictures[i].imageUrl;
            image.alt = galleryPictures[i].title;
        
            const figCaption = document.createElement("figcaption");
            figCaption.innerText = galleryPictures[i].title;
        
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
