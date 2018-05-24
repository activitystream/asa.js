export const formatDateTime = time => {
  const pad = number => {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  };
  const timezone = time => {
    const hours = pad(Math.abs(Math.floor(time / 60)));
    const minutes = pad(Math.abs(time % 60));
    const sign = time > 0 ? "-" : "+";
    return `${sign + hours}:${minutes}`;
  };

  return `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(
    time.getDate()
  )}T${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(
    time.getSeconds()
  )}.${(time.getMilliseconds() / 1000).toFixed(3).slice(2, 5)}${timezone(
    time.getTimezoneOffset()
  )}`;
};
