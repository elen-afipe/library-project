const myLibrary = [];

function getRatingStars(rating, haveListened){
    if (rating >= 1 && rating <= 5 && haveListened === "✓") {
        return ('★'.repeat(rating));
    } else return "";
}
function toggleListenedStatus(e){
   const status = e.target;
    if (status.textContent==="✕"){
        status.textContent="✓"
    }else{status.textContent="✕"}
}

function Album(title, author, year, haveListened, rating, comment) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.haveListened = (haveListened === "✕") ? "✕" : "✓";
    this.rating = getRatingStars(rating, haveListened);
    this.comment = (haveListened === "✕") ? "" : comment;
    this.dataDisplayed = false;
}

function addAlbumToLibrary(title, author, year, haveListened, rating, comment) {
  const myAlbum = new Album(title, author, year, haveListened, rating, comment);
  myLibrary.push(myAlbum);
}

function createAlbumCard(album, albumsContainer){
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
    listenStatus.textContent = `Listened: `;

    const listenStatusSpan = document.createElement("span");
    listenStatusSpan.classList.add("listen-status-span");
    listenStatusSpan.textContent = album.haveListened;
    listenStatusSpan.onclick = toggleListenedStatus;

    albumCard.appendChild(albumCredits);
    albumCard.appendChild(year);
    listenStatus.appendChild(listenStatusSpan);
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
}

addAlbumToLibrary('A', 'B', 365, false, 5, "liked");
addAlbumToLibrary('C', 'tttt', 349, true, "★★★★★", "liked");

function displayLibrary(){
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
    const comment = document.querySelector("#album-comment");
    addAlbumToLibrary(title.value, author.value, year.value, haveListened.textContent, rating.value, comment.value);
    console.log(title.value, author.value, year.value, haveListened.textContent, rating.value, comment.value);
}

document.querySelector(".add-album").addEventListener("click", () => {
    const dialog = document.querySelector(".dialog");
    // show dialog
    dialog.showModal();

    const dialogCloseBtn = document.querySelector(".close-dialog");
    // "Close" button closes the dialog
    dialogCloseBtn.addEventListener("click", () => {
    dialog.close();
    });

    // save data when user clicks sendForm button
    const sendForm = document.querySelector(".send-form");

    sendForm.addEventListener("click", (event) => {
    event.preventDefault();
    sendFormData();
    const form = document.querySelector(".form");
    form.reset();
    const haveListened = document.querySelector(".listen-icon");
    haveListened.textContent="✕";
    dialog.close();
    displayLibrary();
    });
})

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
    status.textContent = "✓";
    status.classList.remove("false");
    }
    else {
        status.textContent = "✕";
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
