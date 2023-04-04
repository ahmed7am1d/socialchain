import dayjs from "dayjs";
export const euDateToISO8601 = async (euDateString) => {
  const parts = euDateString.split("/");
  const year = parts[2];
  const month = parts[1];
  const day = parts[0];
  return `${year}/${month}/${day}`;
};

export const iSO8601ToUnixDate = async (iso8601DateString) =>
  parseInt(new Date(iso8601DateString).getTime() / 1000);

export const UnixDateToiSO860StringDate = async (UnixDate) => {
  const date = new Date(UnixDate * 1000);
  return date.toString(); // convert date to ISO 8601 format
};

export const calculateTimeDifferenceString = async (date) => {
  const today = dayjs();
  const dayjsOtherDate = dayjs(date);
  const differenceHours = Math.abs(dayjsOtherDate.diff(today, "hour"));
  const differenceMinutes = Math.abs(dayjsOtherDate.diff(today, "minute"));
  if (differenceHours > 24) {
    const differenceDays = Math.abs(dayjsOtherDate.diff(today, "day"));
    return `${
      differenceDays > 1
        ? `${differenceHours} days ago`
        : `${differenceHours} day ago`
    }`;
  }
  else if (differenceMinutes <= 60) {
    return `${
      differenceMinutes > 1
        ? `${differenceMinutes} minutes ago`
        : `${differenceMinutes} minute ago`
    }`;
  }
  return `${
    differenceHours > 1
      ? `${differenceHours} hours ago`
      : `${differenceHours} hour ago`
  }`;
};
