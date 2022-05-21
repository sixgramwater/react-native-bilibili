export interface ReplayItem {
  rpid:          number;
  oid:           number;
  type:          number;
  mid:           number;
  root:          number;
  parent:        number;
  dialog:        number;
  count:         number;
  rcount:        number;
  state:         number;
  fansgrade:     number;
  attr:          number;
  ctime:         number;
  rpid_str:      string;
  root_str:      string;
  parent_str:    string;
  like:          number;
  action:        number;
  member:        ReplayItemMember;
  content:       Content;
  replies:       Reply[];
  assist:        number;
  folder:        Folder;
  up_action:     UpAction;
  show_follow:   boolean;
  invisible:     boolean;
  reply_control: ReplayItemReplyControl;
}

export interface Content {
  message:  string;
  plat:     number;
  device:   string;
  members:  MemberElement[];
  emote?:   Emote;
  jump_url: JumpURL;
  max_line: number;
}

export interface Emote {
  "[tv_doge]": TvDoge;
}

export interface TvDoge {
  id:         number;
  package_id: number;
  state:      number;
  type:       number;
  attr:       number;
  text:       string;
  url:        string;
  meta:       Meta;
  mtime:      number;
  gif_url:    string;
  jump_title: string;
}

export interface Meta {
  size: number;
}

export interface JumpURL {
}

export interface MemberElement {
  mid:              string;
  uname:            string;
  sex:              string;
  sign:             string;
  avatar:           string;
  rank:             string;
  DisplayRank:      string;
  face_nft_new:     number;
  is_senior_member: number;
  level_info:       LevelInfo;
  pendant:          Pendant;
  nameplate:        Nameplate;
  official_verify:  OfficialVerify;
  vip:              Vip;
}

export interface LevelInfo {
  current_level: number;
  current_min:   number;
  current_exp:   number;
  next_exp:      number;
}

export interface Nameplate {
  nid:         number;
  name:        string;
  image:       string;
  image_small: string;
  level:       string;
  condition:   string;
}

export interface OfficialVerify {
  type: number;
  desc: string;
}

export interface Pendant {
  pid:                 number;
  name:                string;
  image:               string;
  expire:              number;
  image_enhance:       string;
  image_enhance_frame: string;
}

export interface Vip {
  vipType:               number;
  vipDueDate:            number;
  dueRemark:             string;
  accessStatus:          number;
  vipStatus:             number;
  vipStatusWarn:         string;
  themeType:             number;
  label:                 Label;
  avatar_subscript:      number;
  nickname_color:        string;
  avatar_subscript_url?: string;
}

export interface Label {
  path:         string;
  text:         string;
  label_theme:  string;
  text_color:   string;
  bg_style:     number;
  bg_color:     string;
  border_color: string;
}

export interface Folder {
  has_folded: boolean;
  is_folded:  boolean;
  rule:       string;
}

export interface ReplayItemMember {
  mid:              string;
  uname:            string;
  sex:              string;
  sign:             string;
  avatar:           string;
  rank:             string;
  DisplayRank:      string;
  face_nft_new:     number;
  is_senior_member: number;
  level_info:       LevelInfo;
  pendant:          Pendant;
  nameplate:        Nameplate;
  official_verify:  OfficialVerify;
  vip:              Vip;
  fans_detail:      null;
  following:        number;
  is_followed:      number;
  user_sailing:     UserSailing;
  is_contractor:    boolean;
  contract_desc:    string;
  nft_interaction:  null;
}

export interface UserSailing {
  pendant:           null;
  cardbg:            Cardbg | null;
  cardbg_with_focus: null;
}

export interface Cardbg {
  id:       number;
  name:     string;
  image:    string;
  jump_url: string;
  fan:      Fan;
  type:     string;
}

export interface Fan {
  is_fan:   number;
  number:   number;
  color:    string;
  name:     string;
  num_desc: string;
}

export interface Reply {
  rpid:          number;
  oid:           number;
  type:          number;
  mid:           number;
  root:          number;
  parent:        number;
  dialog:        number;
  count:         number;
  rcount:        number;
  state:         number;
  fansgrade:     number;
  attr:          number;
  ctime:         number;
  rpid_str:      string;
  root_str:      string;
  parent_str:    string;
  like:          number;
  action:        number;
  member:        ReplayItemMember;
  content:       Content;
  replies:       null;
  assist:        number;
  folder:        Folder;
  up_action:     UpAction;
  show_follow:   boolean;
  invisible:     boolean;
  reply_control: ReplyReplyControl;
}

export interface ReplyReplyControl {
  time_desc: string;
}

export interface UpAction {
  like:  boolean;
  reply: boolean;
}

export interface ReplayItemReplyControl {
  sub_reply_entry_text: string;
  sub_reply_title_text: string;
  time_desc:            string;
}
