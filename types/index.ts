export interface ListItemType {
  id: number;
  bvid: string;
  cid: number;
  goto: string;
  uri: string;
  pic: string;
  title: string;
  duration: number;
  pubdate: number;
  owner: Owner;
  stat: Stat;
  av_feature: null;
  is_followed: number;
  rcmd_reason: null;
  show_info: number;
  track_id: string;
}

export interface Owner {
  mid: number;
  name: string;
  face: string;
}

export interface Stat {
  view: number;
  like: number;
  danmaku: number;
}
