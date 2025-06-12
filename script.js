const myLibrary = [];
let cardMode = "add";
let cardAsTarget;

const symbols = {
  cross: "✕",
  tick: "✓",
  star: "★",
  blankStar: "☆",
};

function getRatingStars(rating) {
  if (rating >= 1 && rating <= 5) {
    return symbols.star.repeat(rating);
  } else return symbols.blankStar.repeat(5);
}

function toggleListenedStatus(e) {
  const status = e.target;
  const div = e.target.parentNode;
  const card = div.parentNode;
  // update card textContent and meta (dataset.listenedStatus)
  if (status.textContent === symbols.cross) {
    status.textContent = symbols.tick;
    card.dataset.listenedStatus = symbols.tick;
  } else {
    status.textContent = symbols.cross;
    card.dataset.listenedStatus = symbols.cross;
  }
  editListenedStatusInLibrary(card.dataset.listenedStatus, card);
  saveLibraryToLocalStorage();
}

let currentId = 0;
function generateAlbumId() {
  currentId += 1;
  return currentId;
}

class Album {
  constructor(title, author, year, haveListened, rating, comment) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.haveListened =
      haveListened === symbols.cross ? symbols.cross : symbols.tick;
    this.ratingNumber = rating !== "" ? rating : false;
    this.rating = getRatingStars(rating);
    this.comment = comment;
    this.dataDisplayed = false;
    this.id = generateAlbumId();
  }
}

function addAlbumToLibrary(title, author, year, haveListened, rating, comment) {
  const myAlbum = new Album(title, author, year, haveListened, rating, comment);
  myLibrary.push(myAlbum);
  saveLibraryToLocalStorage();
}

function getAlbumIndex(card) {
  const id = parseInt(card.dataset.id);
  return myLibrary.findIndex((album) => album.id === id);
}

function deleteAlbumFromLibrary(e) {
  const card = e.target.parentNode;
  card.remove();
  const cardIndex = getAlbumIndex(card);
  myLibrary.splice(cardIndex, 1);
  saveLibraryToLocalStorage();
}

function setRatingForEdit(value) {
  const star = document.querySelector(
    `input[name="star-rating"][value="${value}"]`
  );
  if (star) {
    star.checked = true;
  }
}

function preloadInputs(e) {
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
  const listenedStatus = libraryAlbum.haveListened;

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
  // listenedStatusInput.textContent = card.dataset.listenedStatus;
  listenedStatusInput.textContent = listenedStatus;
  setRatingForEdit(ratingNumber);
  commentInput.value = comment;
}

function editAlbumInLibrary(
  cardAsTarget,
  title,
  author,
  year,
  haveListened,
  rating,
  comment
) {
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
  saveLibraryToLocalStorage();
}

function editListenedStatusInLibrary(listenedStatus, card) {
  // look for card in Library array
  const cardIndex = getAlbumIndex(card.parentNode);
  const libraryAlbum = myLibrary[cardIndex];
  // update card info in lib
  libraryAlbum.haveListened = listenedStatus;
}

function editAlbumCard(
  cardAsTarget,
  title,
  author,
  year,
  haveListened,
  rating,
  comment
) {
  const card = cardAsTarget;
  const cardTitle = card.querySelector(".album-title");
  const cardAuthor = card.querySelector(".album-author");
  const cardYear = card.querySelector(".album-year");
  const cardHaveListened = card.querySelector(".listen-status-span");
  const cardRating = card.querySelector(".album-rating");
  const cardComment = card.querySelector(".album-comment");
  cardTitle.textContent = title;
  cardAuthor.textContent = author;
  cardYear.textContent = year;
  cardHaveListened.textContent = haveListened;
  cardRating.textContent = getRatingStars(rating);
  cardComment.textContent = comment;
}

function saveCardEdit(cardAsTarget) {
  const title = document.querySelector("#album-title");
  const author = document.querySelector("#album-author");
  const year = document.querySelector("#album-year");
  const haveListened = document.querySelector(".listen-icon");
  const rating = document.querySelector('input[name="star-rating"]:checked');
  const ratingValue = rating ? rating.value : "";
  const comment = document.querySelector("#album-comment");
  editAlbumInLibrary(
    cardAsTarget,
    title.value,
    author.value,
    year.value,
    haveListened.textContent,
    ratingValue,
    comment.value
  );
  editAlbumCard(
    cardAsTarget,
    title.value,
    author.value,
    year.value,
    haveListened.textContent,
    ratingValue,
    comment.value
  );
}

function getCardAsTarget(e) {
  return e.target.parentNode;
}
function openEditAlbumCard(e) {
  cardMode = "edit";
  removeErrorStyle();
  dialog.querySelector(".send-form").textContent = "Save";
  preloadInputs(e);
  cardAsTarget = getCardAsTarget(e);
  dialog.showModal();
}

function createAlbumCard(album, albumsContainer) {
  const albumCard = document.createElement("div");
  albumCard.classList.add("album-card");

  const deleteAlbumBtn = document.createElement("div");
  deleteAlbumBtn.classList.add("delete-album");
  deleteAlbumBtn.classList.add("btn");
  deleteAlbumBtn.tabIndex = 0;
  deleteAlbumBtn.textContent = symbols.cross;
  deleteAlbumBtn.onclick = deleteAlbumFromLibrary;

  const albumInfo = document.createElement("div");
  albumInfo.classList.add("album-info-container");

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
  albumCard.appendChild(albumInfo);
  albumInfo.appendChild(albumCredits);
  albumInfo.appendChild(year);
  listenStatus.appendChild(listenStatusSpan);
  albumInfo.appendChild(listenStatus);

  const rating = document.createElement("p");
  rating.classList.add("album-rating");
  rating.textContent = `${album.rating}`;
  albumInfo.appendChild(rating);

  const comment = document.createElement("p");
  comment.classList.add("album-comment");
  comment.textContent = `${album.comment}`;
  albumInfo.appendChild(comment);
  albumCard.appendChild(albumInfo);

  const editAlbumBtn = document.createElement("img");
  editAlbumBtn.classList.add("edit-album");
  editAlbumBtn.classList.add("btn");
  editAlbumBtn.classList.add("svg");
  editAlbumBtn.tabIndex = 0;
  editAlbumBtn.src = "./icons/edit.svg";
  editAlbumBtn.onclick = openEditAlbumCard;
  albumCard.appendChild(editAlbumBtn);

  // set meta for deletion and search
  albumCard.dataset.id = album.id;
  albumCard.dataset.listenedStatus = album.haveListened;

  albumsContainer.appendChild(albumCard);
}

function displayLibrary() {
  const albumsContainer = document.querySelector(".albums-container");
  myLibrary.forEach((album) => {
    if (album.dataDisplayed === false) {
      createAlbumCard(album, albumsContainer);
      album.dataDisplayed = true;
    } else {
      return;
    }
  });
}

function saveLibraryToLocalStorage() {
  localStorage.setItem("albumLibrary", JSON.stringify(myLibrary));
}

function loadLibraryFromLocalStorage() {
  const savedLibrary = localStorage.getItem("albumLibrary");
  if (savedLibrary) {
    const parsedLibrary = JSON.parse(savedLibrary);
    myLibrary.length = 0;

    parsedLibrary.forEach((albumData) => {
      const album = new Album(
        albumData.title,
        albumData.author,
        albumData.year,
        albumData.haveListened,
        albumData.ratingNumber,
        albumData.comment
      );
      album.id = albumData.id;
      album.dataDisplayed = false;
      myLibrary.push(album);
    });
    const maxId = Math.max(...myLibrary.map((album) => album.id), 0);
    currentId = maxId;
  } else {
    addAlbumToLibrary("...At This", "Arc", 1971, symbols.tick, 5, "Cool riffs");
    addAlbumToLibrary(
      "The Road",
      "Quiet World",
      1970,
      symbols.cross,
      "",
      "Tried once, but wanna relisten"
    );

    addAlbumToLibrary(
      "Exile on Main St.",
      "The Rolling Stones",
      1972,
      symbols.tick,
      5,
      "Classic"
    );
    addAlbumToLibrary(
      "Sticky Fingers",
      "The Rolling Stones",
      1971,
      symbols.tick,
      5,
      "Absolute banger"
    );
    addAlbumToLibrary(
      "Goats Head Soup",
      "The Rolling Stones",
      1973,
      symbols.tick,
      5,
      "Can listen to it forever"
    );
    addAlbumToLibrary(
      `The Boy Bands Have Won, and All the Copyists and the Tribute Bands and the TV Talent Show Producers Have Won, If We Allow Our Culture to Be Shaped by Mimicry, Whether from Lack of Ideas or from Exaggerated Respect. You Should Never Try to Freeze Culture. What You Can Do Is Recycle That Culture. Take Your Older Brother's Hand-Me-Down Jacket and Re-Style It, Re-Fashion It to the Point Where It Becomes Your Own. But Don't Just Regurgitate Creative History, or Hold Art and Music and Literature as Fixed, Untouchable and Kept Under Glass. The People Who Try to 'Guard' Any Particular Form of Music Are, Like the Copyists and Manufactured Bands, Doing It the Worst Disservice, Because the Only Thing That You Can Do to Music That Will Damage It Is Not Change It, Not Make It Your Own. Because Then It Dies, Then It's Over, Then It's Done, and the Boy Bands Have Won`,
      "Chumbawamba",
      2008,
      symbols.cross,
      "",
      "Wow, what a title!"
    );
  }
}

loadLibraryFromLocalStorage();
displayLibrary();

function sendFormData() {
  const title = document.querySelector("#album-title");
  const author = document.querySelector("#album-author");
  const year = document.querySelector("#album-year");
  const haveListened = document.querySelector(".listen-icon");
  const rating = document.querySelector('input[name="star-rating"]:checked');
  const ratingValue = rating ? rating.value : "";
  const comment = document.querySelector("#album-comment");
  addAlbumToLibrary(
    title.value,
    author.value,
    year.value,
    haveListened.textContent,
    ratingValue,
    comment.value
  );
}

const dialog = document.querySelector(".dialog");
const sendForm = document.querySelector(".send-form");

// open dialog
document.querySelector(".add-album").addEventListener("click", () => {
  cardMode = "add";
  removeErrorStyle();
  form.reset();
  listenStatusReset();
  dialog.querySelector(".send-form").textContent = "Add album";
  dialog.showModal();
});

// "Close" button closes the dialog
const dialogCloseBtn = document.querySelector(".close-dialog");
dialogCloseBtn.addEventListener("click", () => {
  removeErrorStyle();
  dialog.close();
  form.reset();
  // listenStatusReset();
});

// close dialog on blur
dialog.addEventListener("click", () => dialog.close());
const dialogContent = document.querySelector(".dialog-content");
dialogContent.addEventListener("click", (event) => event.stopPropagation());

// listened reset for form
function listenStatusReset() {
  const haveListened = document.querySelector(".listen-icon");
  haveListened.textContent = symbols.cross;
}

const currentYear = new Date().getFullYear();
// max year of album in form
document.addEventListener("DOMContentLoaded", () => {
  const albumYearInput = document.getElementById("album-year");
  albumYearInput.setAttribute("max", currentYear);
});
// listen status in form
document.querySelector(".listen-icon").addEventListener("click", (event) => {
  const status = event.target;
  if (status.classList.contains("false")) {
    status.textContent = symbols.tick;
    status.classList.remove("false");
  } else {
    status.textContent = symbols.cross;
    status.classList.add("false");
  }
});
// rating in form
function enableRating(inputBox) {
  const labels = [...inputBox.querySelectorAll("label")];
  const inputs = [...inputBox.querySelectorAll("input")];

  labels.forEach((e, index) =>
    e.addEventListener("mouseover", (e) => {
      for (let i = 0; i < labels.length; i++) {
        labels[i].style.color = i <= index ? "#d4af37" : "#888";
      }
    })
  );

  labels.forEach((e, index) =>
    e.addEventListener("mouseleave", (e) => {
      const checkedIndex = inputs.findIndex((e) => e.checked);
      for (let i = 0; i < labels.length; i++) {
        labels[i].style.color = i <= checkedIndex ? "#d4af37" : "#888";
      }
    })
  );
}
enableRating(document.querySelector(".rating-box"));

function updateFilteredLibrary() {
  const albumsContainer = document.querySelector(".albums-container");
  albumsContainer.innerHTML = "";
  myLibrary.forEach((album) => {
    createAlbumCard(album, albumsContainer);
  });
}
function sortLibrary(criteria) {
  switch (criteria) {
    case "author-asc":
      myLibrary.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "author-desc":
      myLibrary.sort((a, b) => b.author.localeCompare(a.author));
      break;
    case "year-asc":
      myLibrary.sort((a, b) => b.year - a.year);
      break;
    case "year-desc":
      myLibrary.sort((a, b) => a.year - b.year);
      break;
    case "listen-asc":
      myLibrary.sort(
        (a, b) =>
          (b.haveListened === "✓" ? 1 : 0) - (a.haveListened === "✓" ? 1 : 0)
      );
      break;
    case "listen-desc":
      myLibrary.sort(
        (a, b) =>
          (a.haveListened === "✓" ? 1 : 0) - (b.haveListened === "✓" ? 1 : 0)
      ); // Not listened first
      break;
  }
  updateFilteredLibrary();
}
document
  .querySelector('select[name="author-selection"]')
  .addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    sortLibrary(selectedValue);
  });
document
  .querySelector('select[name="listen-selection"]')
  .addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    sortLibrary(selectedValue);
  });
document
  .querySelector('select[name="year-selection"]')
  .addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    sortLibrary(selectedValue);
  });

const form = document.querySelector(".form");
const titleInput = document.getElementById("album-title");
const titleError = document.querySelector(".error.title");
const authorInput = document.getElementById("album-author");
const authorError = document.querySelector(".error.author");
const yearInput = document.getElementById("album-year");
const yearError = document.querySelector(".error.year");

titleInput.addEventListener("input", (event) => {
  if (titleInput.validity.valid & (titleInput.value.trim() !== "")) {
    titleError.textContent = "";
    titleError.classList.remove("active");
  } else {
    showError();
  }
});

authorInput.addEventListener("input", (event) => {
  if (authorInput.validity.valid & (authorInput.value.trim() !== "")) {
    authorError.textContent = "";
    authorError.classList.remove("active");
  } else {
    showError();
  }
});

yearInput.addEventListener("input", (event) => {
  if (yearInput.validity.valid) {
    yearError.textContent = "";
    yearError.classList.remove("active");
  } else {
    showError();
  }
});

function showTitleError() {
  if (titleInput.validity.valueMissing | (titleInput.value.trim() === "")) {
    titleError.textContent = "Fill the title of the album";
    titleError.classList.add("active");
  }
}
function showAuthorError() {
  if (authorInput.validity.valueMissing | (authorInput.value.trim() === "")) {
    authorError.textContent = "Fill the name of the artist";
    authorError.classList.add("active");
  }
}
function showYearError() {
  if (yearInput.validity.valueMissing) {
    yearError.textContent = "Fill the year of the album as number";
    yearError.classList.add("active");
  } else if (yearInput.validity.typeMismatch) {
    yearError.textContent = "Oh, come on! Year should be a number!";
    yearError.classList.add("active");
  } else if (yearInput.validity.rangeUnderflow) {
    yearError.textContent = `Year should have at least 4 numbers`;
    yearError.classList.add("active");
  } else if (yearInput.validity.rangeOverflow) {
    yearError.textContent = `Come on! You haven't listen it yet. It's ${currentYear}!`;
    yearError.classList.add("active");
  }
}

function showError() {
  showTitleError();
  showAuthorError();
  showYearError();
}

function removeErrorStyle() {
  titleError.classList.remove("active");
  authorError.classList.remove("active");
  yearError.classList.remove("active");
  titleError.textContent = "";
  authorError.textContent = "";
  yearError.textContent = "";
}

function checkFormValidity() {
  if (
    !titleInput.validity.valid |
    !authorInput.validity.valid |
    !yearInput.validity.valid |
    (titleInput.value.trim() === "") |
    (authorInput.value.trim() === "")
  ) {
    showError();
    return false;
  } else return true;
}

sendForm.addEventListener("click", (event) => {
  event.preventDefault();
  const formIsValid = checkFormValidity();
  if (formIsValid) {
    // send form data when inputs are valid
    if (cardMode !== "add") {
      saveCardEdit(cardAsTarget);
    } else {
      sendFormData();
    }
    // reset form
    form.reset();
    listenStatusReset();

    dialog.close();
    displayLibrary();
  }
});
