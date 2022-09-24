const localStorageKey = "bookshelfApp";
const saveBook = document.getElementById("bookSubmit");
let books = [];

const checkSupportedStorage = () => {
  return typeof Storage !== undefined;
};

const addBookToStorage = (book) => {
  books.push(book);
  localStorage.setItem(localStorageKey, JSON.stringify(books));
};

saveBook.addEventListener("click", (event) => {
  event.preventDefault();
  const book = {
    id: Date.now(),
    title: document.getElementById("inputBookTitle").value,
    author: document.getElementById("inputBookAuthor").value,
    year: document.getElementById("inputBookYear").value,
    isComplete: document.getElementById("inputBookIsComplete").checked,
  };
  addBookToStorage(book);
  checkLocalStorage();
  clearInput();
});

const filterBook = (isComplete) => {
  return books.filter((book) => book.isComplete === isComplete);
};

const showUnreadBook = (searchBook) => {
  if (searchBook === undefined) {
    searchBook = filterBook(false);
  }
  const unreadBookContainer = document.getElementById(
    "incompleteBookshelfList"
  );
  unreadBookContainer.innerHTML = "";
  for (const book of searchBook) {
    if (book.isComplete === false) {
      unreadBookContainer.innerHTML += `
        <article class="book_item" > 
          <h3>${book.title}</h3>
          <p>${book.author}</p> 
          <p>Tahun: ${book.year}</p> 
          <div class="action"> 
            <button class="green" onclick="filterRead(${book.id})">Selesai dibaca</button> 
            <button class="red" onclick="delateBook(${book.id})">Hapus buku</button> 
          </div> 
        </article>
    `;
    } else {
      unreadBookContainer.innerHTML = `Tidak ada buku ${book.title} yang belum dibaca`;
    }
  }
};

const showReadBook = (searchBook) => {
  if (searchBook === undefined) {
    searchBook = filterBook(true);
  }
  const readBookContainer = document.getElementById("completeBookshelfList");
  readBookContainer.innerHTML = "";
  for (const book of searchBook) {
    if (book.isComplete === true) {
      readBookContainer.innerHTML += `
        <article class="book_item" > 
          <h3>${book.title}</h3>
          <p>${book.author}</p> 
          <p>Tahun: ${book.year}</p> 
          <div class="action"> 
            <button class="green" onclick="filterUnread(${book.id})">Belum Selesai dibaca</button> 
            <button class="red" onclick="delateBook(${book.id})">Hapus buku</button> 
          </div> 
        </article>
    `;
    } else {
      readBookContainer.innerHTML = `Tidak ada buku ${book.title} yang sudah dibaca`;
    }
  }
};

const clearInput = () => {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
};

const checkLocalStorage = () => {
  if (checkSupportedStorage()) {
    if (localStorage.getItem(localStorageKey) === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem(localStorageKey));
      showReadBook();
      showUnreadBook();
    }
  }
};

const deleteBook = (bookId) => {
  books = books.filter((book) => book.id !== bookId);
  localStorage.setItem(localStorageKey, JSON.stringify(books));
  checkLocalStorage();
  setTimeout(() => {
    alert("Buku berhasil dihapus");
  }, 200);
};

document.addEventListener("DOMContentLoaded", () => {
  checkLocalStorage();
});

const delateBook = (bookId) => {
  const confirmDelete = confirm("Apakah anda yakin ingin menghapus buku ini?");
  if (confirmDelete) {
    deleteBook(bookId);
  }
};

const filterUnread = (bookId) => {
  const book = books.find((book) => book.id === bookId);
  book.isComplete = false;
  localStorage.setItem(localStorageKey, JSON.stringify(books));
  checkLocalStorage();
};

const filterRead = (bookId) => {
  const book = books.find((book) => book.id === bookId);
  book.isComplete = true;
  localStorage.setItem(localStorageKey, JSON.stringify(books));
  checkLocalStorage();
};

const searchBook = () => {
  const keyword = document.getElementById("searchBookTitle").value;
  const searchBook = books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );
  if (!keyword) {
    checkLocalStorage();
  } else {
    showReadBook(searchBook);
    showUnreadBook(searchBook);
  }
};

const searchSubmit = document.getElementById("searchSubmit");
searchSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  searchBook();
});
