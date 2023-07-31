const formatDate = (dateString, hours = true) => {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: hours ? "2-digit" : undefined,
    minute: hours ? "2-digit" : undefined,
  };

  const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(date);
  return formattedDate;
};

export default formatDate;
