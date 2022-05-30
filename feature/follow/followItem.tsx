import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { AntDesign, Octicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { color } from "react-native-reanimated";

export interface FollowItemProps {
  mid: number;
  attribute: number;
  uname: string;
  official_verify: {
    type: number;
    desc: string;
  };
  vip: {
    vipType: number;
    vipStatus: number;
  };
  sign: string;
  face: string;
}

const FollowItem: React.FC<FollowItemProps> = (props) => {
  const { mid, attribute, uname, official_verify, vip, sign, face } = props;
  const isAnnualVip = vip.vipStatus === 1 && vip.vipType === 2;
  return (
    <View style={styles.followItemContainer}>
      <Pressable style={styles.avatarContainer}>
        <Image source={{ uri: face }} style={styles.avatar} />
      </Pressable>
      <View style={styles.infoContainer}>
        <Pressable onPress={() => console.log(isAnnualVip)}>
          <Text
            style={[styles.uname, isAnnualVip && { color: Colors.light.tint }]}
          >
            {uname}
          </Text>
        </Pressable>
        <Text style={styles.desc} numberOfLines={1}>
          {official_verify.desc === "" ? sign : official_verify.desc}
        </Text>
      </View>
      <View style={styles.followButton}>
        <Pressable style={styles.button}>
          <Octicons
            name="three-bars"
            color={"#999999"}
            size={13}
            style={{
              marginRight: 2,
              justifyContent: "center",
              height: "100%",
              transform: [{ translateY: 2 }],
            }}
          />
          {/* <AntDesign name='plus' color={Colors.light.tint}/> */}
          <Text style={styles.buttonText}>已关注</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FollowItem;

const styles = StyleSheet.create({
  followItemContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderTopColor: "#f4f5f7",
    borderTopWidth: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 48,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  infoContainer: {
    justifyContent: "center",
    flex: 1,
    paddingRight: 18,
  },
  uname: {
    fontSize: 15,
    marginBottom: 1,
  },
  desc: {
    fontSize: 12,
    color: "#95989d",
  },
  followButton: {
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#e7e7e7",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "#999999",
    fontSize: 13,
  },
});
