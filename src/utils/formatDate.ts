export const formatDate = (date: string) => {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();

  return `${day <= 9 ? "0" : ""}${day}/${
    month <= 9 ? "0" : ""
  }${month}/${year}`;
};
