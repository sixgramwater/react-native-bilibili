import matchAll from "string.prototype.matchall";

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

export const getMinutesSecondsFromMilliseconds = (ms: number) => {
  const totalSeconds = ms / 1000;
  const seconds = String(Math.floor(totalSeconds % 60));
  const minutes = String(Math.floor(totalSeconds / 60));

  return minutes.padStart(1, "0") + ":" + seconds.padStart(2, "0");
};

export const backgroundLinearImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAC0CAYAAABVEkZPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACaSURBVHgBlZLbDsQgCETLYP//i5UVtkYhuG59IFzODGnKdZ0eQWMSaFfST2TL0bmHXS+bhoBzD2+ybMAJgp0WiXb2ghWDmYFaa8ZBH6O1Nv1KwrGB32zAnLg8nGXDau4ti4z60+yGiFhZNAvOIdzKQbmy9MIX2V/t3HM+HbZSNAt3JcgOzrQmc/A6cIhEgwH/v9L1xG8j77coPnsUOUD2dBlAAAAAAElFTkSuQmCC";

type DanmuType = {
  startTime: number;
  type: number;
  size: number;
  color: string;
  sendTime: number;
  poolType: number;
  userHash: string;
  dmid: number;
  content: string;
};
export const parseDanmuToJSON = (xml: string) => {
  let regExp = /<d ([a-zA-Z]+.*?)>([\s\S]*?)<\/[a-zA-Z]*?>/g;
  const matches = matchAll(xml, regExp);
  const mapped = [...matches].map((item) => {
    const infoList = item[1].substring(3, item[1].length - 1).split(",");
    return {
      startTime: Number(infoList[0]),
      type: Number(infoList[1]),
      size: Number(infoList[2]),
      color: "#" + Number(infoList[3]).toString(16),
      sendTime: Number(infoList[4]),
      poolType: Number(infoList[5]),
      userHash: infoList[6],
      dmid: Number(infoList[7]),
      content: item[2],
    } as DanmuType;
  });
  return mapped;
};
