import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { formatDate } from "../../utils";

export interface ReplyItemProps {
  rpid: number;
  oid: number;
  message: string;
  rcount: number; // 回复评论条数
  ctime: number;
  like: number;
  time_desc?: string;
  member: {
    avatar: string;
    mid: number;
    uname: string;
  };
  replies: {
    uname: string;
    message: string;
    mid: number;
  }[];
  replyControl: {
    time_desc?: string;
    sub_reply_entry_text?: string;
    // "sub_reply_entry_text": "共48条回复",
    //                 "sub_reply_title_text": "相关回复共48条",
    //               "time_desc": "1天前发布"
  };
}

const SubReplyItem = ({
  uname,
  message,
  mid,
}: {
  uname: string;
  message: string;
  mid: number;
}) => {
  return (
    <Pressable
      android_ripple={{
        radius: 200,
        borderless: false,
        foreground: true,
      }}
    >
      <Text style={styles.subReplyItem} numberOfLines={2}>
        <Text style={[styles.subReplyText, { color: Colors.light.blue }]}>
          {uname + ": "}
        </Text>
        <Text style={styles.subReplyText}>
          {message}
          {/* 这是次级回复,但是不知道有多长。有可能有一行，有可能站两行。让我们试试这次有多长，等到你 */}
        </Text>
      </Text>
    </Pressable>
  );
};

const ReplyItem: React.FC<ReplyItemProps> = (props) => {
  const {
    member: { avatar, uname },
    message,
    rcount,
    replies,
    ctime,
    // time_desc,
    like,
    replyControl: { time_desc, sub_reply_entry_text },
  } = props;
  const subReplyText = sub_reply_entry_text?.replace("发布", "");
  const timeDescText = time_desc?.replace("发布", "");
  return (
    <Pressable
      // style={{ flex: 1 }}
      android_ripple={{
        radius: 360,
        borderless: false,
        foreground: true,
      }}
    >
      <View style={styles.replyItemContainer}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: avatar,
            }}
          />
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.userContainer}>
            <View style={styles.usernameContainer}>
              <Text style={[tw`text-gray-600`, { fontSize: 13 }]}>{uname}</Text>
            </View>
            <Text style={[tw`text-gray-500 pt-1`, { fontSize: 10 }]}>
              {timeDescText ?? formatDate(ctime * 1000)}
            </Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <View style={styles.controlContainer}>
            <View style={styles.controlItem}>
              <Feather
                name="thumbs-up"
                size={14}
                color={"#6B7280"}
                style={styles.controlIcon}
              />
              <Text style={{ color: "#6B7280", marginLeft: 4, fontSize: 12 }}>
                {like}
              </Text>
            </View>
            <View style={styles.controlItem}>
              <Feather
                name="thumbs-down"
                size={14}
                color={"#6B7280"}
                style={styles.controlIcon}
              />
              {/* <Text style={{ marginRight: 8 }}>12</Text> */}
            </View>
            {/* <View style={styles.controlItem}>
            <FontAwesome name="share" size={12} color={"#6B7280"}/>
          </View> */}
            <View style={styles.controlItem}>
              <Feather
                name="message-circle"
                size={14}
                color={"#6B7280"}
                style={styles.controlIcon}
              />
            </View>
            {/* <View></View> */}
          </View>
          {replies && replies.length > 0 && (
            <View style={styles.repliesContainer}>
              {replies.map((reply, index) => (
                <SubReplyItem
                  uname={reply.uname}
                  message={reply.message}
                  mid={reply.mid}
                  key={index}
                />
              ))}
              {sub_reply_entry_text && (
                <Pressable
                  android_ripple={{
                    radius: 200,
                    borderless: false,
                    foreground: true,
                  }}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: Colors.light.blue,
                      marginRight: 8,
                      fontSize: 12,
                    }}
                  >
                    {subReplyText}
                    {/* {sub_reply_entry_text.replace("发布", " ")} */}
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={13}
                    color={Colors.light.blue}
                  />
                </Pressable>
              )}
              {/* {rcount > replies.length && (
                <Pressable style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: Colors.light.blue,
                      marginRight: 8,
                      fontSize: 12,
                    }}
                  >
                    共{rcount}条回复
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={13}
                    color={Colors.light.blue}
                  />
                </Pressable>
              )} */}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ReplyItem;

const styles = StyleSheet.create({
  replyItemContainer: {
    width: "100%",
    flexDirection: "row",
    padding: 12,
    borderBottomColor: "#f4f5f4",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 100,
    overflow: "hidden",
  },
  avatar: {
    width: 36,
    height: 36,
  },
  mainContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userContainer: {},
  usernameContainer: {},
  messageContainer: {
    paddingVertical: 10,
  },
  message: {
    fontSize: 15,
    color: "#000",
  },
  controlContainer: {
    paddingTop: 8,
    // paddingBottom:
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:'center'
  },
  controlItem: {
    // padding: 4,
    // marginRight: 'auto',
    // alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  controlIcon: {},
  repliesContainer: {
    marginTop: 8,
    backgroundColor: "#f4f4f4",
    padding: 8,
    borderRadius: 4,
  },
  subReplyItem: {
    flexDirection: "row",
    paddingBottom: 6,
  },
  subReplyText: {
    fontSize: 14,
    color: "#000",
  },
});
