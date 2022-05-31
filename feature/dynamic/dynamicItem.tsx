import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { OfficialVerify } from "../follow/types";
import ImageList from "./imageList";
import ImageView from "react-native-image-viewing";

const WIDTH = Dimensions.get("screen").width;

export enum DYNAMIC_TYPE {
  LIVE_RCMD = "DYNAMIC_TYPE_LIVE_RCMD",
  AV = "DYNAMIC_TYPE_AV",
  DRAW = "DYNAMIC_TYPE_DRAW",
  WORD = "DYNAMIC_TYPE_WORD",
  FORWARD = "DYNAMIC_TYPE_FORWARD",
}

export interface DynamicItemProps {
  type: DYNAMIC_TYPE;
  author: {
    mid: number;
    face: string;
    following: boolean;
    name: string;
    official_verify: {
      desc: string;
      type: number;
    };
    vip: {
      status: number;
      type: number;
    };
    pub_action: string;
    pub_time: string;
  };
  stat: {
    comment: {
      count: number;
    };
    forward: {
      count: number;
    };
    like: {
      count: number;
    };
  };
}

export interface AVDynamicItemProps extends DynamicItemProps {
  aid: string;
  bvid: string;
  cover: string;
  desc: string;
  durationText: string;
  danmaku: string;
  play: string;
  title: string;
  // desc: {
  //   richTextNodes: any[];
  //   text: string;
  // }
  // type: number;
}

export interface LiveDynamicItemProps extends DynamicItemProps {
  roomId: number;
  roomType: number;
  title: string;
  areaName: string;
  watched: number;
  watchedText: string;
  cover: string;
}

export interface DrawDynamicItemProps extends DynamicItemProps {
  items: {
    height: number;
    width: number;
    size: number;
    src: string;
  }[];
  desc: {
    richTextNodes: any[];
    text: string;
  };
}

export interface WordDynamicItemProps extends DynamicItemProps {
  desc: {
    richTextNodes: any[];
    text: string;
  };
}

export interface ForwardDynamicItemProps<
  T extends
    | LiveDynamicItemProps
    | AVDynamicItemProps
    | DynamicItemProps
    | DrawDynamicItemProps
> extends DynamicItemProps {
  orig: T;
  desc: {
    richTextNodes: any[];
    text: string;
  };
}

const DynamicItem: React.FC<DynamicItemProps> = (props) => {
  const { type, author, stat, children } = props;
  // const face =
  //   "https://i2.hdslb.com/bfs/face/957dc9a092be89ee1b6066508120561846ce46bd.jpg@96w_96h_1c_1s.webp";
  // const poster =
  //   "https://i0.hdslb.com/bfs/live/new_room_cover/40f644acebe01836064f75e71f7895ad43a6b372.jpg@406w_254h_1c.webp";
  // const isVip = true;
  const isVip = author.vip.status === 1 && author.vip.type === 2;
  return (
    <View style={styles.itemContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: author.face }} style={styles.avatar} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.uname, isVip && { color: Colors.light.tint }]}>
            {author.name}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.desc}>{author.pub_time}</Text>
            {author.pub_time !== "" && author.pub_action !== "" && (
              <Text style={[styles.desc, { marginHorizontal: 3 }]}>·</Text>
            )}
            <Text style={styles.desc}>{author.pub_action}</Text>
          </View>
        </View>
        <View style={styles.option}>
          <Entypo name="dots-three-vertical" color="#61666c" />
        </View>
      </View>
      {children}
      {/* <View style={styles.liveContainer}></View> */}
      <View style={styles.controlContainer}>
        <View style={styles.controlBtn}>
          <Feather
            name="external-link"
            size={18}
            style={styles.controlIcon}
            color="#78797e"
          ></Feather>
          <Text style={{ color: "#78797e" }}>
            {stat.forward.count === 0 ? "转发" : stat.forward.count}
          </Text>
        </View>
        <View style={styles.controlBtn}>
          <Feather
            name="message-square"
            size={18}
            color="#78797e"
            style={styles.controlIcon}
          ></Feather>
          <Text style={{ color: "#78797e" }}>
            {stat.comment.count === 0 ? "评论" : stat.comment.count}
          </Text>
        </View>
        <View style={styles.controlBtn}>
          <Feather
            name="thumbs-up"
            size={18}
            color="#78797e"
            style={styles.controlIcon}
          ></Feather>
          <Text style={{ color: "#78797e" }}>
            {stat.like.count === 0 ? "点赞" : stat.like.count}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const WordDynamicItem: React.FC<WordDynamicItemProps> = (props) => {
  const { desc } = props;
  return (
    <DynamicItem {...props}>
      <View style={styles.contentContainer}>
        <Text>{desc.text}</Text>
      </View>
    </DynamicItem>
  );
};

export const AVDynamicItem: React.FC<AVDynamicItemProps> = (props) => {
  const { cover, aid, bvid, desc, durationText, danmaku, title, play } = props;
  return (
    <DynamicItem {...props}>
      <View style={styles.AVContainer}>
        <View style={styles.contentContainer}>
          {desc !== "-" && <Text>{desc}</Text>}
        </View>

        <View style={styles.posterContainer}>
          <Image source={{ uri: cover }} style={styles.poster} />
          <View style={styles.footerInfo}>
            {/* <View style={styles.}> */}
            <Text
              style={{
                borderRadius: 4,
                backgroundColor: "rgba(0,0,0,0.5)",
                fontSize: 12,
                color: "#fff",
                paddingHorizontal: 4,
                paddingVertical: 4,
              }}
            >
              {durationText}
            </Text>
            {/* </View> */}
            <Text style={{ fontSize: 12, color: "#fff", marginLeft: 6 }}>
              {play}观看
            </Text>
            <Text style={{ fontSize: 12, color: "#fff", marginLeft: 6 }}>
              {danmaku}弹幕
            </Text>
          </View>
        </View>
        <Text style={styles.avTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </DynamicItem>
  );
};

export const DrawDynamicItem: React.FC<DrawDynamicItemProps> = (props) => {
  const { items, desc } = props;
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const previewImgUrls = items.map((item) => {
    return item.src + `@${Math.floor((3 / 4) * WIDTH)}w`;
  });
  const handleSelect = (index: number) => {
    setOpenIndex(index);
    setVisible(true);
  }
  const imgsList = items.map((item) => {
    return {
      uri: item.src + `@${Math.floor(WIDTH)}w`,
    };
  });

  return (
    <DynamicItem {...props}>
      <View style={{ paddingVertical: 12 }}>
        <View style={styles.contentContainer}>
          <Text>{desc.text}</Text>
        </View>
        <View style={{ paddingVertical: 4 }}>
          <ImageList imgs={previewImgUrls} onSelect={handleSelect}/>
        </View>
        <ImageView
          images={imgsList}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        />
        {/* <View style={styles.imgsContainer}>
          {

          }
        </View> */}
      </View>
    </DynamicItem>
  );
};

export const LiveDynamicItem: React.FC<LiveDynamicItemProps> = (props) => {
  const { areaName, title, cover, watchedText } = props;
  return (
    <DynamicItem {...props}>
      <View style={{ paddingVertical: 12 }}>
        <View style={styles.posterContainer}>
          <Image source={{ uri: cover }} style={styles.poster} />
          <View style={styles.footerInfo}>
            <Text style={{ fontSize: 12, color: "#fff", marginLeft: 6 }}>
              {areaName}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text
              style={{
                borderBottomLeftRadius: 3,
                borderTopLeftRadius: 3,
                // borderRadius: 4,
                backgroundColor: "rgba(0,0,0,0.5)",
                fontSize: 10,
                color: "#fff",
                paddingHorizontal: 6,
                paddingVertical: 4,
              }}
            >
              {watchedText}
            </Text>
            <Text
              style={{
                borderBottomRightRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: Colors.light.tint,
                fontSize: 10,
                color: "#fff",
                paddingHorizontal: 6,
                paddingVertical: 4,
              }}
            >
              直播中
            </Text>
          </View>
        </View>
        <Text style={styles.avTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </DynamicItem>
  );
};

export default DynamicItem;

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 36,
    overflow: "hidden",
  },
  avatar: {
    width: 36,
    height: 36,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  option: {},
  contentContainer: {
    paddingVertical: 8,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 6,
  },
  uname: {
    fontSize: 15,
  },
  desc: {
    fontSize: 12,
    color: "#94999d",
    // color:
  },
  controlBtn: {
    flexDirection: "row",
  },
  controlIcon: {
    marginRight: 4,
  },
  AVContainer: {
    // paddingVertical: 8,
    marginBottom: 8,
  },
  avTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginTop: 6,
    paddingBottom: 6,
    // paddingVertical: 4,
  },
  posterContainer: {
    position: "relative",
  },
  footerInfo: {
    position: "absolute",
    left: 8,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  poster: {
    width: WIDTH - 24,
    height: ((WIDTH - 24) / 16) * 9,
    borderRadius: 4,
  },
  headerInfo: {
    position: "absolute",
    top: 8,
    right: 6,
    flexDirection: "row",
  },
});
