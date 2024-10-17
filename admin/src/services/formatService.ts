export const dateFormat = (dateString: string) => {
  const date = new Date(dateString);

  // Convert to readable format in your timezone (UTC+7)
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh", 
  };

  const formattedDate = date.toLocaleString("vi-VN", options);

  return formattedDate; // Return as DD/MM/YYYY format
};
