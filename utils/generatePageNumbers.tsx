export const generatePageNumbers = (
  totalPage: number,
  setPageNumbers: React.Dispatch<React.SetStateAction<(number | string)[]>>,
  pagination: number
) => {
  if (totalPage && totalPage <= 5) {
    setPageNumbers(Array.from({ length: totalPage }, (_, i) => i + 1));
  } else {
    const pages: (number | string)[] = [];
    pages.push(1);
    if (pagination > 4) {
      pages.push("...");
    }
    const startPage = Math.max(2, pagination - 1);
    const endPage = Math.min(totalPage ? totalPage - 1 : 0, pagination + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (totalPage !== null && pagination < totalPage - 2) {
      pages.push("...");
    }
    if (totalPage !== null) {
      pages.push(totalPage);
    }
    setPageNumbers(pages);
  }
};
