import inst from "./axios";
import axios from "axios";
import qs from "qs";

export const fetchHomeRecommend = () =>
  inst
    .get("https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3")
    .then((value) => value.data);

export const fetchVideoInfo = (aid: number) =>
  inst
    .get("http://api.bilibili.com/x/web-interface/view", { params: { aid } })
    .then((value) => value.data);

export const fetchRelatedVideos = (aid: number) =>
  inst
    .get("http://api.bilibili.com/x/web-interface/archive/related", {
      params: { aid },
    })
    .then((value) => value.data);

export const fetchVideoUrl = (avid: number, cid: number, qn: number) =>
  inst
    .get("http://api.bilibili.com/x/player/playurl", {
      params: { avid, cid, qn },
      // headers: {
      //   'referer': 'https://www.bilibili.com/',
      //   // 'user'
      // },
    })
    .then((value) => value.data);

export const fetchVideoUrlNoReferer = (avid: number, cid: number) =>
  inst
    .get(
      "https://api.bilibili.com/x/player/playurl?platform=html5&otype=json&qn=16&type=mp4&html5=1",
      { params: { avid, cid } }
    )
    .then((value) => value.data);

export const fetchReplyLazy = (oid: number, type: number = 1) =>
  inst
    .get("http://api.bilibili.com/x/v2/reply/main", {
      params: { type, oid },
    })
    .then((value) => value.data);

export const fetchQrcode = () =>
  inst
    .get("http://passport.bilibili.com/qrcode/getLoginUrl")
    .then((value) => value.data);

export const qrLogin = (key: string) =>
  axios.post(
    "http://passport.bilibili.com/qrcode/getLoginInfo",
    qs.stringify({ oauthKey: key }),
    {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      withCredentials: true,
    }
  );

export const fetchUserNav = () =>
  inst.get("http://api.bilibili.com/nav").then((value) => value.data);

export const fetchSearchDefault = (keyword: string) =>
  inst
    .get("http://api.bilibili.com/x/web-interface/search/all/v2", {
      params: { keyword },
    })
    .then((value) => value.data);

export const fetchTrends = () =>
  inst
    .get("https://api.bilibili.com/x/web-interface/search/square?limit=10")
    .then((value) => value.data);

const httpGet = (
  url: string,
  responseType: XMLHttpRequestResponseType
  // args: string
) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(this.response);
      } else {
        reject(new Error(this.status + " " + this.statusText));
      }
    };
    xhr.onerror = function () {
      reject(new Error(this.status + " " + this.statusText));
    };

    xhr.open("GET", url);

    xhr.responseType = responseType;
    xhr.send();
  });
};

// export const fetchDanmuXml = (cid: number) =>
//   httpGet(`http://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`, "text").then(
//     (value) => {
//       console.log(value);
//       return value;
//     }
//   );
export const fetchDanmuXml = (cid: number) =>
  axios
    .get(`http://124.221.204.216:5000/danmuXml/${cid}`)
    .then((value) => value.data);

export const fetchFollowing = (
  mid: number,
  ps: number,
  pn: number,
  orderType?: "" | "attention"
) =>
  inst
    .get("http://api.bilibili.com/x/relation/followings", {
      params: {
        vmid: mid,
        ps,
        pn,
        orderType: orderType ?? "",
      },
    })
    .then((value) => value.data);
