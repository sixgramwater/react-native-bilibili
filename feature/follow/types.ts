export interface FollowItemResType {
  mid:             number;
  attribute:       number;
  mtime:           number;
  tag:             null;
  special:         number;
  uname:           string;
  face:            string;
  sign:            string;
  official_verify: OfficialVerify;
  vip:             Vip;
}

export interface OfficialVerify {
  type: number;
  desc: string;
}

export interface Vip {
  vipType:       number;
  vipDueDate:    number;
  dueRemark:     string;
  accessStatus:  number;
  vipStatus:     number;
  vipStatusWarn: string;
  themeType:     number;
  label:         Label;
}

export interface Label {
  path: string;
}
