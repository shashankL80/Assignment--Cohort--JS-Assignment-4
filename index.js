let page, limit, inc, query;
let result;

const book_container = document.getElementById("book-container");

async function fetchBooks() {
  const URL = `https://api.freeapi.app/api/v1/public/books?
  page=${page || `1`}&
  limit=${limit || `10`}&
  inc=${inc || `kind%252Cid%252Cetag%252CvolumeInfo`}&
  query=${query}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    result = data;
  } catch (error) {
    throw error;
  }
}

fetchBooks().then(() => {
  const books = result?.data?.data;
  console.log(books);

  books?.forEach((book, index) => {
    const card = document.createElement("div");

    const bookImage = document.createElement("img");
    bookImage.src = book?.volumeInfo?.imageLinks?.thumbnail;
    bookImage.alt = "Book Thumbnail";

    const bookTitle = document.createElement("div");
    bookTitle.textContent = book?.volumeInfo?.title;

    const bookAuthor = document.createElement("div");
    book?.volumeInfo?.authors?.map((a) => (bookAuthor.textContent += ` ${a}`));

    const rating = document.createElement("div");
    rating.textContent = book?.volumeInfo?.ratingsCount;

    card.appendChild(bookImage);
    card.appendChild(bookTitle);
    card.appendChild(bookAuthor);
    card.appendChild(rating);
    book_container.append(card);
  });
});
