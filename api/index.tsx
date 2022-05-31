import inst from "./axios";
import axios from "axios";
import qs from "qs";
import {
  AVDynamicItemProps,
  DrawDynamicItemProps,
  DynamicItemProps,
  DYNAMIC_TYPE,
  LiveDynamicItemProps,
  WordDynamicItemProps,
} from "../feature/dynamic/dynamicItem";

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

export const fetchDynamic = () =>
  inst
    .get(
      "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=all&page=1"
    )
    .then((value) => {
      const data = value.data;
      const dataList = data.data.items;
      const mappedList = dataList.map((item: any) => {
        const modules = item.modules;
        const authorModule = modules.module_author;
        const dynamicModule = modules.module_dynamic;
        const statModule = modules.module_stat;
        const type = item.type;

        const dynamicItem: DynamicItemProps = {
          type: item.type,
          author: {
            mid: authorModule.mid,
            face: authorModule.face,
            name: authorModule.name,
            following: authorModule.following,
            official_verify: authorModule.official_verify,
            vip: {
              status: authorModule.vip.status,
              type: authorModule.vip.type,
            },
            pub_action: authorModule.pub_action,
            pub_time: authorModule.pub_time,
          },
          stat: {
            comment: {
              count: statModule.comment.count,
            },
            forward: {
              count: statModule.forward.count,
            },
            like: {
              count: statModule.like.count,
            },
          },
        };
        if (type === DYNAMIC_TYPE.WORD) {
          const wordItem: WordDynamicItemProps = {
            ...dynamicItem,
            desc: dynamicModule.desc,
          };
          return wordItem;
        } else if (type === DYNAMIC_TYPE.AV) {
          const archive = dynamicModule.major.archive;
          const avItem: AVDynamicItemProps = {
            ...dynamicItem,
            aid: archive.aid,
            bvid: archive.bvid,
            cover: archive.cover,
            desc: archive.desc,
            durationText: archive.duration_text,
            play: archive.stat.play,
            danmaku: archive.stat.danmaku,
            title: archive.title,
          };
          return avItem;
        } else if (type === DYNAMIC_TYPE.DRAW) {
          const items = dynamicModule.major.draw.items;
          const drawItem: DrawDynamicItemProps = {
            ...dynamicItem,
            items,
            desc: dynamicModule.desc,
          };
          return drawItem;
        } else if (type === DYNAMIC_TYPE.LIVE_RCMD) {
          const liveRecmd = JSON.parse(dynamicModule.major.live_rcmd.content).live_play_info;
          // console.log(liveRecmd);
          const liveItem: LiveDynamicItemProps = {
            ...dynamicItem,
            roomId: liveRecmd.room_id,
            roomType: liveRecmd.room_type,
            title: liveRecmd.title,
            areaName: liveRecmd.area_name,
            watched: liveRecmd.watched_show?.num,
            watchedText: liveRecmd.watched_show?.text_large,
            cover: liveRecmd.cover,
          };
          return liveItem;
        } else {
        }
      });
      // console.log(mappedList);
      return mappedList;
    });
