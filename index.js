import {
  addClassListsToElement,
  createStarsBasedOnRating,
  sortObjWithStringVal,
  debounce,
} from "./utility/common.js";

let page, limit, inc, query;
let result;

const book_container = document.getElementById("book-container");

const viewType = document.getElementById("view-select");
let viewTypeValue = "list";
addClassListsToElement(["book-container-list"], book_container);

const sorting = document.getElementById("sort-select");
let sortingValue = "ascending";

const basedOnSelect = document.getElementById("based-on-select");
let basedOnSelectValue = "title";

const searchBooksInput = document.getElementById("search-books-input");

const parentContainer = document.getElementById("root");
const darkLightModeButton = document.getElementById("dark-light-mode-logo");
let darkMode = false;

// console.log(viewTypeValue);

async function fetchBooks(searchBookValue) {
  const URL = `https://api.freeapi.app/api/v1/public/books?
  page=${page || `1`}&
  limit=${limit || `10`}&
  inc=${inc || `kind%252Cid%252Cetag%252CvolumeInfo`}&
  query=${searchBookValue}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    result = data;
  } catch (error) {
    throw error;
  }
}

darkLightModeButton.addEventListener("click", () => {
  if (darkMode) {
    parentContainer.classList.add("dark-mode");
    parentContainer.classList.remove("light-mode");
    darkLightModeButton.src = "./assets/img/lightMode.png";
  } else {
    parentContainer.classList.add("light-mode");
    parentContainer.classList.remove("dark-mode");
    darkLightModeButton.src = "./assets/img/darkMode.png";
  }

  darkMode = !darkMode;
});

const initialize = (searchBookValue) => {
  fetchBooks(searchBookValue).then(() => {
    book_container.textContent = "";
    let books = result?.data?.data;
    console.log(books);
    renderBooks(books);

    basedOnSelect.addEventListener("change", () => {
      book_container.textContent = "";
      basedOnSelectValue = basedOnSelect.value;
      const sortedBooks = sortObjWithStringVal(
        books,
        basedOnSelectValue,
        sortingValue
      );
      console.log("sortedBooks", sortedBooks);
      renderBooks(sortedBooks);
    });

    sorting.addEventListener("change", function () {
      book_container.textContent = "";
      sortingValue = sorting.value;
      const sortedBooks = sortObjWithStringVal(
        books,
        basedOnSelectValue,
        sortingValue
      );
      renderBooks(sortedBooks);
    });
  });
};
initialize();

//debounce
const debouncedInitialize = debounce(initialize, 1000);
searchBooksInput.addEventListener("keyup", () => {
  const searchBookValue = searchBooksInput.value;
  console.log(searchBookValue);
  debouncedInitialize(searchBookValue);
  // initialize(searchBookValue)
});

const renderBooks = (books) => {
  books?.forEach((book, index) => {
    const card = document.createElement("div");

    const bookImage = document.createElement("img");
    bookImage.src = book?.volumeInfo?.imageLinks?.thumbnail;
    bookImage.alt = "Book Thumbnail";
    addClassListsToElement(["book-image"], bookImage);

    const bookTitle = document.createElement("div");
    bookTitle.textContent = book?.volumeInfo?.title;

    addClassListsToElement(["book-title"], bookTitle);

    const bookAuthor = document.createElement("div");
    bookAuthor.textContent = `Authors : ${book?.volumeInfo?.authors
      ?.toString()
      ?.replaceAll(",", ", ")} `;
    addClassListsToElement(["book-authors"], bookAuthor);

    const rating = document.createElement("div");
    const ratingCount = book?.volumeInfo?.ratingsCount;
    createStarsBasedOnRating(ratingCount, rating);
    addClassListsToElement(["book-rating"], rating);

    const description = document.createElement("div");
    const viewMoreButton = document.createElement("button");
    viewMoreButton.textContent = "View More";
    let showMoreText = false;
    description.textContent = `${book?.volumeInfo?.description?.slice(
      0,
      250
    )}... `;

    viewMoreButton.addEventListener("click", () => {
      showMoreText = !showMoreText;
      description.textContent = showMoreText
        ? `${book?.volumeInfo?.description} `
        : `${book?.volumeInfo?.description?.slice(0, 250)}... `;
      viewMoreButton.textContent = showMoreText ? "View Less" : "View More";
      description.appendChild(viewMoreButton);
    });

    description.appendChild(viewMoreButton);
    addClassListsToElement(["book-description"], description);
    addClassListsToElement(["view-more-button"], viewMoreButton);

    const bookInformation = document.createElement("div");
    bookInformation.appendChild(bookTitle);
    bookInformation.appendChild(bookAuthor);
    bookInformation.appendChild(rating);
    bookInformation.appendChild(description);

    addClassListsToElement(["book-information"], bookInformation);

    card.appendChild(bookImage);
    card.appendChild(bookInformation);
    addClassListsToElement(["card-list"], card);
    book_container.append(card);

    viewType.addEventListener("change", () => {
      viewTypeValue = viewType.value;
      console.log(viewTypeValue);
      switch (viewTypeValue) {
        case "list":
          book_container.classList.remove("book-container-grid");
          card.classList.remove("card-grid");
          addClassListsToElement(["book-container-list"], book_container);
          addClassListsToElement(["card-list"], card);
          break;
        case "grid":
          book_container.classList.remove("book-container-list");
          card.classList.remove("card-list");
          addClassListsToElement(["book-container-grid"], book_container);
          addClassListsToElement(["card-grid"], card);
          break;
      }
    });
  });
};
