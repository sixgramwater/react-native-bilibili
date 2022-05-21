export const formatNum = (num?: number) => {
  if (num === undefined) return "";
  let res = "";
  if (num >= 10000) {
    res += (num / 10000).toFixed(1) + "万";
  } else {
    res = num.toString();
  }
  return res;
};

export const formatDate = (date?: number) => {
  if (date === undefined) return "";
  const dateString = new Date(date * 1000).toISOString();
  return dateString.substring(0, 10) + " " + dateString.substring(11, 16);
};

