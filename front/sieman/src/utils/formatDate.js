const formatDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(date);
  return formattedDate;
};

export default formatDate;
