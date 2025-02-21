const myLibrary = [];

    const symbols = {
        cross: "✕",
        tick: "✓",
        star: '★',
    }
function getRatingStars(rating, haveListened){
    if (rating >= 1 && rating <= 5) {
        return (symbols.star.repeat(rating));
    } else return "";
}
function toggleListenedStatus(e){
   const status = e.target;
    if (status.textContent===symbols.cross){
        status.textContent= symbols.tick
    }else{status.textContent=symbols.cross}
}

function Album(title, author, year, haveListened, rating, comment) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.haveListened = (haveListened === symbols.cross) ? symbols.cross : symbols.tick;
    this.ratingNumber = (rating !== "") ? rating : false;
    this.rating = getRatingStars(rating, haveListened);
    this.comment = comment;
    this.dataDisplayed = false;
}

function addAlbumToLibrary(title, author, year, haveListened, rating, comment) {
  const myAlbum = new Album(title, author, year, haveListened, rating, comment);
  console.log(myAlbum);
  myLibrary.push(myAlbum);
}

function getAlbumIndex(card){
    const title = card.dataset.title;
    const author = card.dataset.author;
    const year = parseInt(card.dataset.year); 

    return myLibrary.findIndex(album => 
        album.title === title &&
        album.author === author &&
        album.year === year
      );
}

function deleteAlbumFromLibrary(e){
    console.log(e.target.parentNode)
    const card = e.target.parentNode;
    card.remove();
    const cardIndex = getAlbumIndex(card);
    myLibrary.splice(cardIndex, 1);
    console.log(myLibrary)
}

function createAlbumCard(album, albumsContainer){
    console.log(`album ${album}`)
    console.log(`album container ${albumsContainer}`)
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");
    
    const deleteAlbumBtn = document.createElement("div");
    deleteAlbumBtn.classList.add("delete-album");
    deleteAlbumBtn.classList.add("btn");
    deleteAlbumBtn.tabIndex = 0;
    deleteAlbumBtn.textContent = symbols.cross;
    deleteAlbumBtn.onclick = deleteAlbumFromLibrary;

    const albumCredits = document.createElement("h2");
    albumCredits.classList.add("album-title");
    albumCredits.textContent = `"${album.title}" by ${album.author}`;

    const year = document.createElement("p");
    year.classList.add("album-year");
    year.textContent = album.year;

    const listenStatus = document.createElement("p");
    listenStatus.classList.add("listen-status");
    listenStatus.textContent = `Listened: `;

    const listenStatusSpan = document.createElement("span");
    listenStatusSpan.classList.add("listen-status-span");
    listenStatusSpan.textContent = album.haveListened;
    listenStatusSpan.onclick = toggleListenedStatus;

    albumCard.appendChild(deleteAlbumBtn);
    albumCard.appendChild(albumCredits);
    albumCard.appendChild(year);
    listenStatus.appendChild(listenStatusSpan);
    albumCard.appendChild(listenStatus);

    const rating = document.createElement("p");
    rating.classList.add("album-rating");
    rating.textContent = `${album.rating}`;
    albumCard.appendChild(rating);

    const comment = document.createElement("p");
    comment.classList.add("album-comment");
    comment.textContent = `${album.comment}`;
    albumCard.appendChild(comment);
    
    // set meta for deletion and search
    albumCard.dataset.title = album.title;
    albumCard.dataset.author = album.author;
    albumCard.dataset.year = album.year;

    albumsContainer.appendChild(albumCard);
    console.log(myLibrary)
    console.log("append")
}

addAlbumToLibrary('...At This', 'Arc', 1971, symbols.tick, 5, "Cool riffs");
addAlbumToLibrary('The Road', 'Quiet World', 1970, symbols.cross);

function displayLibrary(){
    // console.log(myLibrary);
    const albumsContainer = document.querySelector(".albums-container");
    myLibrary.forEach(album =>{ 
        if(album.dataDisplayed === false){
        createAlbumCard(album, albumsContainer);
        album.dataDisplayed = true;
        } else {return}
});
}

displayLibrary();

function sendFormData () {
    const title = document.querySelector("#album-title");
    const author = document.querySelector("#album-author");
    const year = document.querySelector("#album-year");
    const haveListened = document.querySelector(".listen-icon");
    const rating = document.querySelector('input[name="star-rating"]:checked');
    const ratingValue = rating ? rating.value : "";
    const comment = document.querySelector("#album-comment");
    addAlbumToLibrary(title.value, author.value, year.value, haveListened.textContent, ratingValue, comment.value);
    console.log(title.value, author.value, year.value, haveListened.textContent, ratingValue, comment.value);
}

const dialog = document.querySelector(".dialog");
const sendForm = document.querySelector(".send-form");

document.querySelector(".add-album").addEventListener("click", () => {
    // show dialog
    dialog.showModal();
    // "Close" button closes the dialog
    const dialogCloseBtn = document.querySelector(".close-dialog");
    dialogCloseBtn.addEventListener("click", () => {
        dialog.close();
        const form = document.querySelector(".form");
        form.reset();
        listenStatusReset();
    });
    
})

// close dialog on blur
dialog.addEventListener('click', () => dialog.close());

const dialogContent = document.querySelector('.dialog-content');
dialogContent.addEventListener('click', (event) => event.stopPropagation());

// send form data when form submit button clicked
sendForm.addEventListener("click", (event) => {
    event.preventDefault();

    sendFormData();

    // reset form
    const form = document.querySelector(".form");
    form.reset();
    listenStatusReset();

    dialog.close();
    displayLibrary();
});


// listened reset for form
function listenStatusReset(){
const haveListened = document.querySelector(".listen-icon");
haveListened.textContent= symbols.cross;
}


// max year of album in form
document.addEventListener("DOMContentLoaded", () => {
    const currentYear = new Date().getFullYear();
    const albumYearInput = document.getElementById("album-year");
    albumYearInput.setAttribute("max", currentYear);
});
// listen status in form
document.querySelector(".listen-icon").addEventListener("click", (event) => {
    const status = event.target;
    if(status.classList.contains("false")){
    status.textContent = symbols.tick;
    status.classList.remove("false");
    }
    else {
        status.textContent = symbols.cross;
        status.classList.add("false");
    }
})
// rating in form
function enableRating(inputBox){
    const labels =[...inputBox.querySelectorAll("label")];
    const inputs =[...inputBox.querySelectorAll("input")]


        labels.forEach((e, index) => e.addEventListener("mouseover", (e)=>{
         for(let i=0;i<labels.length;i++){
            labels[i].style.color = ((i <= index) ? "#391854" : "#888");
        }
     }));

        labels.forEach((e, index) => e.addEventListener("mouseleave", (e)=>{
            const checkedIndex = inputs.findIndex(e => e.checked);
            for(let i=0;i<labels.length;i++){
                labels[i].style.color = ((i <= checkedIndex) ? "#391854" : "#888");
            };
    }));
}
    enableRating(document.querySelector(".rating-box"));


