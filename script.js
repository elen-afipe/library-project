const myLibrary = [];


function Album(title, author, year, haveListened, rating, comment) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.haveListened = (haveListened === false) ? "✕" : "✓";
    this.rating = (haveListened === false) ? "" : rating;
    this.comment = (haveListened === false) ? "" : comment;
}

function addAlbumToLibrary(title, author, year, haveListened, rating, comment) {
  const myAlbum = new Album(title, author, year, haveListened, rating, comment);
  myLibrary.push(myAlbum);
}

addAlbumToLibrary('A', 'B', 365, false, 5, "liked");
addAlbumToLibrary('C', 'tttt', 349, true, "★★★★★", "liked");

function displayLibrary(){
    const albumsContainer = document.querySelector(".albums-container");
    myLibrary.forEach(album =>{
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");
    
    const albumCredits = document.createElement("h2");
    albumCredits.classList.add("album-title");
    albumCredits.textContent = `"${album.title}" by ${album.author}`;

    const year = document.createElement("p");
    year.classList.add("album-year");
    year.textContent = album.year;

    const listenStatus = document.createElement("p");
    listenStatus.classList.add("listen-status");
    listenStatus.textContent = `Listened: ${album.haveListened}`;

    albumCard.appendChild(albumCredits);
    albumCard.appendChild(year);
    albumCard.appendChild(listenStatus);

    if(album.rating !== ""){
    const rating = document.createElement("p");
    rating.classList.add("album-rating");
    rating.textContent = `${album.rating}`;
    albumCard.appendChild(rating);
    }
    if(album.comment !== ""){
    const comment = document.createElement("p");
    comment.classList.add("album-comment");
    comment.textContent = `${album.comment}`;
    albumCard.appendChild(comment);
    }
    
    albumsContainer.appendChild(albumCard);
});
}

displayLibrary();

createFormHTML = () => {
     const dialog = document.createElement("dialog");
     dialog.classList.add("dialog");
     document.body.appendChild(dialog);
 
     const dialogCloseBtn = document.createElement("img");
     dialogCloseBtn.classList.add("close-dialog");
     dialogCloseBtn.classList.add("btn");
     dialogCloseBtn.src="./icons/cancel.svg";
     dialog.appendChild(dialogCloseBtn);
     
     const form = document.createElement("form");
     dialog.classList.add("form");
     dialog.appendChild(form);
 
     const titleRow = document.createElement("div");
     titleRow.classList.add("form-row");
     form.appendChild(titleRow);
 
     const titleLabel = document.createElement("label");
     titleLabel.for="album-title";
     titleLabel.textContent = "Title: ";
     titleRow.appendChild(titleLabel);
 
     const title = document.createElement("input");
     title.id = "album-title";
     title.name = "album-title";
     title.type = "text";
     title.required = true;
     titleRow.appendChild(title);
 
     const authorRow = document.createElement("div");
     authorRow.classList.add("form-row");
     form.appendChild(authorRow);
 
     const authorLabel = document.createElement("label");
     authorLabel.for="album-author";
     authorLabel.textContent = "Author: ";
     authorRow.appendChild(authorLabel);
 
     const author = document.createElement("input");
     author.id = "album-author";
     author.name = "album-author";
     author.type = "album-author";
     author.required = true;
     authorRow.appendChild(author);
}

document.querySelector(".add-album").addEventListener("click", () => {

    // create dialog elements
    createFormHTML();

    const dialog = document.querySelector(".dialog");
    // show dialog
    dialog.showModal();

    const dialogCloseBtn = document.querySelector(".close-dialog");
    // "Close" button closes the dialog
    dialogCloseBtn.addEventListener("click", () => {
    dialog.close();
    });
})