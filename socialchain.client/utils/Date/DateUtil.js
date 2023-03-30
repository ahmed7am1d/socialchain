export const euDateToISO8601 = async (euDateString) => {
  const parts = euDateString.split("/");
  const year = parts[2];
  const month = parts[1];
  const day = parts[0];
  return `${year}/${month}/${day}`;
};

export const iSO8601ToUnixDate = async (iso8601DateString) =>
  parseInt(new Date(iso8601DateString).getTime() / 1000);
