const myLibrary = [];

function Book(title, author, page_number, haveRead, rating, comment) {
    this.title = title;
    this.author = author;
    this.page_number = page_number;
    this.haveRead = (haveRead === false) ? "✕" : "✓";
    this.rating = (haveRead === false) ? "" : rating;
    this.comment = (haveRead === false) ? "" : comment;
    this.displayBookInfo = function(){
        console.log(`${title} by ${author}, ${page_number} pages, ${haveRead}"}`)
    }
}

function addBookToLibrary(title, author, page_number, haveRead, rating, comment) {
  const myBook = new Book(title, author, page_number, haveRead, rating, comment);
  myLibrary.push(myBook);
}

addBookToLibrary('A', 'B', 365, false, 5, "liked");
addBookToLibrary('C', 'tttt', 349, true, "★★★★★", "liked");

function displayLibrary(){
    const booksContainer = document.querySelector(".books-container");
    myLibrary.forEach(book =>{
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    
    const bookCredits = document.createElement("h2");
    bookCredits.classList.add("book-title");
    bookCredits.textContent = `"${book.title}" by ${book.author}`;

    const pages = document.createElement("p");
    pages.classList.add("book-pages");
    pages.textContent = (book.page_number > 1) ? `${book.page_number} pages` : `${book.page_number} page`;

    const readStatus = document.createElement("p");
    readStatus.classList.add("read-status");
    readStatus.textContent = `Read: ${book.haveRead}`;

    bookCard.appendChild(bookCredits);
    bookCard.appendChild(pages);
    bookCard.appendChild(readStatus);

    if(book.rating !== ""){
    const rating = document.createElement("p");
    rating.classList.add("book-rating");
    rating.textContent = `${book.rating}`;
    bookCard.appendChild(rating);
    }
    if(book.comment !== ""){
    const comment = document.createElement("p");
    comment.classList.add("book-comment");
    comment.textContent = `${book.comment}`;
    bookCard.appendChild(comment);
    }
    
    booksContainer.appendChild(bookCard);
});
}

displayLibrary();