const myLibrary = [];
let cardMode = "add";

    const symbols = {
        cross: "✕",
        tick: "✓",
        star: '★',
        blankStar:"☆",
    }
function getRatingStars(rating){
    if (rating >= 1 && rating <= 5) {
        return (symbols.star.repeat(rating));
    } else return symbols.blankStar.repeat(5);
}
function toggleListenedStatus(e){
   const status = e.target;
   const div = e.target.parentNode;
   const card = div.parentNode;
    // update card textContent and meta (dataset.listenedStatus) 
    if (status.textContent===symbols.cross){
        status.textContent= symbols.tick;
        card.dataset.listenedStatus = symbols.tick;
    }else{
        status.textContent=symbols.cross;
        card.dataset.listenedStatus = symbols.cross;
    }

}

let currentId = 0;
function generateAlbumId(){
    currentId+=1;
    return currentId;
}

function Album(title, author, year, haveListened, rating, comment) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.haveListened = (haveListened === symbols.cross) ? symbols.cross : symbols.tick;
    this.ratingNumber = (rating !== "") ? rating : false;
    this.rating = getRatingStars(rating);
    this.comment = comment;
    this.dataDisplayed = false;
    this.id = generateAlbumId();
}

function addAlbumToLibrary(title, author, year, haveListened, rating, comment) {
  const myAlbum = new Album(title, author, year, haveListened, rating, comment);
  console.log(myAlbum);
  myLibrary.push(myAlbum);
}

function getAlbumIndex(card){
    const id = parseInt(card.dataset.id);
    return myLibrary.findIndex(album => 
        album.id === id
      );
}

function deleteAlbumFromLibrary(e){
    const card = e.target.parentNode;
    card.remove();
    const cardIndex = getAlbumIndex(card);
    myLibrary.splice(cardIndex, 1);
    console.log(myLibrary)
}

function setRatingForEdit(value) {
    const star = document.querySelector(`input[name="star-rating"][value="${value}"]`);
    if (star) {
      star.checked = true;
    }
  }


  function preloadInputs(e){
    // card and according library album
    const card = e.target.parentNode;
    const cardIndex = getAlbumIndex(card);
    const libraryAlbum = myLibrary[cardIndex];
    
    // saved album meta from library
    const title = libraryAlbum.title;
    const author = libraryAlbum.author;
    const year = libraryAlbum.year;
    const ratingNumber = libraryAlbum.ratingNumber;
    const comment = libraryAlbum.comment;

    // inputs
    const albumInput = document.querySelector("#album-title");
    const authorInput = document.querySelector("#album-author");
    const yearInput = document.querySelector("#album-year");
    const listenedStatusInput = document.querySelector(".listen-icon");

    const commentInput = document.querySelector("#album-comment");
    
    // send meta to inputs in form so they can be edited
    albumInput.value = title;
    authorInput.value = author;
    yearInput.value = year;
    listenedStatusInput.textContent = card.dataset.listenedStatus;
    setRatingForEdit(ratingNumber); 
    commentInput.value = comment;
  }

  function editAlbumInLibrary(cardAsTarget, title, author, year, haveListened, rating, comment){
    const card = cardAsTarget;
    // look for card in Library array
    const cardIndex = getAlbumIndex(card);
    const libraryAlbum = myLibrary[cardIndex];
    // update card info in lib
    libraryAlbum.title = title;
    libraryAlbum.author = author;
    libraryAlbum.year = year;
    libraryAlbum.haveListened = haveListened;
    libraryAlbum.ratingNumber = rating;
    libraryAlbum.rating = getRatingStars(rating);
    libraryAlbum.comment = comment;
  }

  function editAlbumCard(cardAsTarget, title, author, year, haveListened, rating, comment){
    const card = cardAsTarget;
    const cardTitle = card.querySelector('.album-title');
    const cardAuthor = card.querySelector('.album-author');
    const cardYear = card.querySelector('.album-year');
    const cardHaveListened = card.querySelector('.listen-status-span');
    const cardRating = card.querySelector('.album-rating');
    const cardComment = card.querySelector('.album-comment');
    cardTitle.textContent = title;
    cardAuthor.textContent = author;
    cardYear.textContent = year;
    cardHaveListened.textContent = haveListened;
    cardRating.textContent = getRatingStars(rating);
    cardComment.textContent = comment;
  }

function saveCardEdit(cardAsTarget){
    const title = document.querySelector("#album-title");
    const author = document.querySelector("#album-author");
    const year = document.querySelector("#album-year");
    const haveListened = document.querySelector(".listen-icon");
    const rating = document.querySelector('input[name="star-rating"]:checked');
    const ratingValue = rating ? rating.value : "";
    const comment = document.querySelector("#album-comment");
    editAlbumInLibrary(cardAsTarget, title.value, author.value, year.value, haveListened.textContent, ratingValue, comment.value);
    editAlbumCard(cardAsTarget, title.value, author.value, year.value, haveListened.textContent, ratingValue, comment.value);
}
let cardAsTarget;
function getCardAsTarget(e){
    return e.target.parentNode;
}
function openEditAlbumCard(e){
    cardMode = "edit";
    dialog.querySelector(".send-form").textContent="Save";
    preloadInputs(e);
    cardAsTarget = getCardAsTarget(e);
    dialog.showModal();
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

    const albumTitle = document.createElement("span");
    albumTitle.classList.add("album-title");
    albumTitle.textContent = album.title;

    const byText = document.createTextNode(" by ");

    const albumAuthor = document.createElement("span");
    albumAuthor.classList.add("album-author");
    albumAuthor.textContent = album.author;

    const albumCredits = document.createElement("h2");
    albumCredits.classList.add("album-credits");

    albumCredits.appendChild(albumTitle);
    albumCredits.appendChild(byText);
    albumCredits.appendChild(albumAuthor);

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

    const editAlbumBtn = document.createElement("img");
    editAlbumBtn.classList.add("edit-album");
    editAlbumBtn.classList.add("btn");
    editAlbumBtn.tabIndex = 0;
    editAlbumBtn.src="./icons/edit.svg";
    editAlbumBtn.onclick = openEditAlbumCard;
    albumCard.appendChild(editAlbumBtn);
    
    // set meta for deletion and search
    albumCard.dataset.id = album.id;
    albumCard.dataset.listenedStatus = album.haveListened;

    albumsContainer.appendChild(albumCard);
    console.log(myLibrary)
    console.log("append")
}

addAlbumToLibrary('...At This', 'Arc', 1971, symbols.tick, 5, "Cool riffs");
addAlbumToLibrary('The Road', 'Quiet World', 1970, symbols.cross, "", "Tried, but wanna listen fully");

addAlbumToLibrary('Exile on Main St.', 'The Rolling Stones', 1972, symbols.tick, 5, 'Classic');
addAlbumToLibrary('Sticky Fingers', 'The Rolling Stones', 1971, symbols.tick, 5, 'Absolute banger');
addAlbumToLibrary('Goats Head Soup', 'The Rolling Stones', 1973, symbols.cross, 5, 'Can listen to it forever');


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

// open dialog
document.querySelector(".add-album").addEventListener("click", () => {
    cardMode = "add";
    dialog.querySelector(".send-form").textContent="Add album";
    dialog.showModal();   
})

 // "Close" button closes the dialog
 const dialogCloseBtn = document.querySelector(".close-dialog");
 dialogCloseBtn.addEventListener("click", () => {
     dialog.close();
     const form = document.querySelector(".form");
     form.reset();
     listenStatusReset();
 });

// close dialog on blur
dialog.addEventListener('click', () => dialog.close());
const dialogContent = document.querySelector('.dialog-content');
dialogContent.addEventListener('click', (event) => event.stopPropagation());

// send form data when form submit button clicked
sendForm.addEventListener("click", (event) => {
    event.preventDefault();
    if (cardMode !== "add"){
        saveCardEdit(cardAsTarget);
    } else {
    sendFormData() }

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

    function updateFilteredLibrary(){
            const albumsContainer = document.querySelector(".albums-container");
            albumsContainer.innerHTML = '';
            myLibrary.forEach(album =>{ 
                createAlbumCard(album, albumsContainer);
        });
        
    }
    function sortLibrary(criteria) {
        switch (criteria) {
            case 'author-asc':
                myLibrary.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case 'author-desc':
                myLibrary.sort((a, b) => b.author.localeCompare(a.author));
                break;
            case 'year-asc':
                myLibrary.sort((a, b) => b.year - a.year);  
                break;
            case 'year-desc':
                myLibrary.sort((a, b) => a.year - b.year);  
                break;
            case 'listen-asc':
                myLibrary.sort((a, b) => (b.haveListened === '✓' ? 1 : 0) - (a.haveListened === '✓' ? 1 : 0)); 
                break;
            case 'listen-desc':
                myLibrary.sort((a, b) => (a.haveListened === '✓' ? 1 : 0) - (b.haveListened === '✓' ? 1 : 0));  // Not listened first
                break;
        }
        updateFilteredLibrary();
    }
    document.querySelector('select[name="author-selection"]').addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        sortLibrary(selectedValue);
    });
    document.querySelector('select[name="listen-selection"]').addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        sortLibrary(selectedValue);
    });
    document.querySelector('select[name="year-selection"]').addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        sortLibrary(selectedValue);
    });

// add input check
