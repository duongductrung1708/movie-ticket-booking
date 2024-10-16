export const dateFormat = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed, so +1
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
