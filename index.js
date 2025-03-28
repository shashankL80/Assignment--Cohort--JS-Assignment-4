import {
  addClassListsToElement,
  sortObjWithStringVal,
  debounce,
} from "./utility/common.js";

let inc = "kind%252Cid%252Cetag%252CvolumeInfo";
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

const itemsPerPageInput = document.getElementById("items-per-page");
const paginationContainer = document.getElementById("pagination-container");

const root = document.querySelector(":root");

async function fetchBooks(searchBookValue, limit, page) {
  const URL = `https://api.freeapi.app/api/v1/public/books?page=${
    page || `1`
  }&limit=${limit || `10`}&inc=${
    inc || `kind%252Cid%252Cetag%252CvolumeInfo`
  }&query=${searchBookValue}`;

  try {
    if (URL) {
      const response = await fetch(URL);
      const data = await response.json();
      result = data;
    }
  } catch (error) {
    throw error;
  }
}

darkLightModeButton.addEventListener("click", () => {
  if (darkMode) {
    parentContainer.classList.add("dark-mode");
    parentContainer.classList.remove("light-mode");
    darkLightModeButton.src = "./assets/img/lightMode.png";
    root.style.setProperty("--theme", "dark-mode");
  } else {
    parentContainer.classList.add("light-mode");
    parentContainer.classList.remove("dark-mode");
    darkLightModeButton.src = "./assets/img/darkMode.png";
    root.style.setProperty("--theme", "light-mode");
  }

  darkMode = !darkMode;
});

const initialize = (searchBookValue = "", limit, page) => {
  fetchBooks(searchBookValue, limit, page).then(() => {
    book_container.textContent = "";
    let books = result?.data?.data;
    let paginationInfo = result?.data;
    renderBooks(books);
    updatePaginationUI(result);
  });
};

function updatePaginationUI(result) {
  let books = result?.data?.data;
  let paginationInfo = result?.data;

  let start =
    paginationInfo?.page === 1
      ? 1
      : paginationInfo?.limit * (paginationInfo?.page - 1) + 1;
  let end =
    paginationInfo?.page === 1
      ? paginationInfo?.limit
      : paginationInfo?.limit * paginationInfo?.page;

  if (Number(end) > Number(paginationInfo?.totalItems)) {
    end = paginationInfo?.totalItems;
  }

  if (
    Array.from(document.getElementsByClassName("pagination-range")).length > 0
  ) {
    const toBeRemovedPaginationRange = Array.from(
      document.getElementsByClassName("pagination-range")
    )?.[0];
    toBeRemovedPaginationRange.remove();
  }

  const paginationRange = document.createElement("div");
  paginationRange.textContent = `${start}-${end} of ${paginationInfo?.totalItems}`;
  paginationContainer.appendChild(paginationRange);
  addClassListsToElement(["pagination-range"], paginationRange);

  if (
    Array.from(document.getElementsByClassName("next-page-button")).length > 0
  ) {
    document.querySelector(".next-page-button")?.remove();
  }

  if (
    Array.from(document.getElementsByClassName("prev-page-button")).length > 0
  ) {
    document.querySelector(".prev-page-button")?.remove();
  }

  const nextPageButton = document.createElement("button");
  nextPageButton.textContent = `>`;
  const prevPageButton = document.createElement("button");
  prevPageButton.textContent = `<`;
  addClassListsToElement(["next-page-button"], nextPageButton);
  addClassListsToElement(["prev-page-button"], prevPageButton);

  nextPageButton.disabled = !paginationInfo?.nextPage;
  prevPageButton.disabled = !paginationInfo?.previousPage;

  paginationContainer.appendChild(prevPageButton);
  paginationContainer.appendChild(nextPageButton);

  nextPageButton.addEventListener("click", () => {
    if (!paginationInfo?.nextPage) {
      nextPageButton.disabled = true;
      return;
    }
    const search = searchBooksInput.value;
    const limit = itemsPerPageInput.value;
    const currentPage = paginationInfo?.page || 1;
    initialize(search, limit, `${Number(currentPage) + 1}`);
  });

  prevPageButton.addEventListener("click", () => {
    if (!paginationInfo?.previousPage) {
      prevPageButton.disabled = true;
      return;
    }
    const search = searchBooksInput.value;
    const limit = itemsPerPageInput.value;
    initialize(search, limit, `${Number(paginationInfo?.page) - 1}`);
  });

  basedOnSelect.addEventListener("change", () => {
    book_container.textContent = "";
    basedOnSelectValue = basedOnSelect.value;
    const sortedBooks = sortObjWithStringVal(
      books,
      basedOnSelectValue,
      sortingValue
    );
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
}

const debouncedInitialize = debounce(initialize, 1000);

searchBooksInput.addEventListener("keyup", () => {
  const searchBookValue = searchBooksInput.value;

  debouncedInitialize(searchBookValue, itemsPerPageInput.value, 1);
});

itemsPerPageInput.addEventListener("change", () => {
  const itemsPerPageInputVal = itemsPerPageInput.value;
  setTimeout(
    () => initialize(searchBooksInput.value, itemsPerPageInputVal, 1),
    0
  );
});

initialize();

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
    bookAuthor.textContent = `Author(s) : ${book?.volumeInfo?.authors
      ?.toString()
      ?.replaceAll(",", ", ")} `;
    addClassListsToElement(["book-authors"], bookAuthor);

    const publishedDateElement = document.createElement("div");
    const publishedDate = book?.volumeInfo?.publishedDate;
    publishedDateElement.textContent = publishedDate
      ?.split("-")
      ?.reverse()
      ?.join("-");
    addClassListsToElement(["book-published-date"], publishedDateElement);

    const publisherElement = document.createElement("div");
    const publisher = book?.volumeInfo?.publisher;
    publisherElement.textContent = `Publisher : ${publisher}`;
    addClassListsToElement(["book-publisher"], publisherElement);

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
    bookInformation.appendChild(publishedDateElement);
    bookInformation.appendChild(publisherElement);
    bookInformation.appendChild(description);

    addClassListsToElement(["book-information"], bookInformation);

    card.appendChild(bookImage);
    card.appendChild(bookInformation);
    book_container.append(card);

    function decideViewType() {
      viewTypeValue = viewType.value;
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
    }
    decideViewType();

    viewType.addEventListener("change", () => {
      decideViewType();
    });
  });
};
