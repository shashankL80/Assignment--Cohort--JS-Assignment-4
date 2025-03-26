export const addClassListsToElement = (classListArray = [], targetElement) => {
  if (classListArray?.length > 0) {
    classListArray?.map((c) => targetElement.classList.add([c]));
  }
};

export const createStarsBasedOnRating = (ratingCount, ratingElement) => {
  if (!ratingCount) {
    ratingElement.textContent = `Rating Not Available`;
    addClassListsToElement(["no-book-rating"], ratingElement);
    return;
  }
  for (let i = 0; i < ratingCount; i++) {
    ratingElement.textContent += `★`;
  }
};

export const sortObjWithStringVal = (booksArray, sortOrder, sortBy) => {
  console.log(sortOrder);
  const result = [...booksArray];
  const isAscending = sortBy === "ascending";
  const final = result.sort(function (a, b) {
    let x = a?.volumeInfo?.[sortOrder]?.toLowerCase();
    let y = b?.volumeInfo?.[sortOrder]?.toLowerCase();
    if (isAscending ? x < y : x > y) {
      return -1;
    }
    if (isAscending ? x > y : x < y) {
      return 1;
    }
    return 0;
  });

  return final
};

export const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}
