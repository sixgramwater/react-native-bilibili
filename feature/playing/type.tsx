export interface VideoInfo {
  bvid:              string;
  aid:               number;
  videos:            number;
  tid:               number;
  tname:             string;
  copyright:         number;
  pic:               string;
  title:             string;
  pubdate:           number;
  ctime:             number;
  desc:              string;
  desc_v2:           DescV2[];
  state:             number;
  duration:          number;
  rights:            { [key: string]: number };
  owner:             Owner;
  stat:              Stat;
  dynamic:           string;
  cid:               number;
  dimension:         Dimension;
  premiere:          null;
  teenage_mode:      number;
  no_cache:          boolean;
  pages:             Page[];
  subtitle:          Subtitle;
  label:             Label;
  is_season_display: boolean;
  user_garb:         any;
  honor_reply:       HonorReply;
}

export interface DescV2 {
  raw_text: string;
  type:     number;
  biz_id:   number;
}

export interface Dimension {
  width:  number;
  height: number;
  rotate: number;
}

export interface HonorReply {
  honor: Honor[];
}

export interface Honor {
  aid:                  number;
  type:                 number;
  desc:                 string;
  weekly_recommend_num: number;
}

export interface Label {
  type: number;
}

export interface Owner {
  mid:  number;
  name: string;
  face: string;
}

export interface Page {
  cid:         number;
  page:        number;
  from:        string;
  part:        string;
  duration:    number;
  vid:         string;
  weblink:     string;
  dimension:   Dimension;
  first_frame: string;
}

export interface Stat {
  aid:        number;
  view:       number;
  danmaku:    number;
  reply:      number;
  favorite:   number;
  coin:       number;
  share:      number;
  now_rank:   number;
  his_rank:   number;
  like:       number;
  dislike:    number;
  evaluation: string;
  argue_msg:  string;
}

export interface Subtitle {
  allow_submit: boolean;
  list:         any[];
}

export interface RecommendVideoInfo {
  aid:           number;
  videos:        number;
  tid:           number;
  tname:         string;
  copyright:     number;
  pic:           string;
  title:         string;
  pubdate:       number;
  ctime:         number;
  desc:          string;
  state:         number;
  duration:      number;
  rights:        { [key: string]: number };
  owner:         Owner;
  stat:          { [key: string]: number };
  dynamic:       string;
  cid:           number;
  dimension:     Dimension;
  short_link:    string;
  short_link_v2: string;
  first_frame:   string;
  bvid:          string;
  season_type:   number;
  is_ogv:        boolean;
  ogv_info:      null;
  rcmd_reason:   string;
}

// export interface Dimension {
//   width:  number;
//   height: number;
//   rotate: number;
// }

// export interface Owner {
//   mid:  number;
//   name: string;
//   face: string;
// }
