import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { CardProps } from "../../../components/card";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatNum } from "../../../utils";
import tw from "twrnc";
import Colors from "../../../constants/Colors";

const WIDTH = Dimensions.get("screen").width;
const SPACING = 12;

const HORIZONTAL_IMG_WIDTH = WIDTH / 2 - SPACING - 10;
const HORIZONTAL_IMG_HEIGHT = (HORIZONTAL_IMG_WIDTH * 9) / 16;

export const renderTitle = (text: string) => {
  if (!text) return null;
  let regExp = /<[a-zA-Z]+.*?>([\s\S]*?)<\/[a-zA-Z]*?>/g;
  let regExpAll = /(<[a-zA-Z]+.*?>[\s\S]*?<\/[a-zA-Z]*?>)/g;
  const segments = text.split(regExpAll).filter((item) => item !== "");
  let transformed: { content: string; shouldTransform: boolean }[] = [];
  segments.forEach((seg) => {
    // console.log(seg);
    if (regExp.test(seg)) {
      try {
        let newReg = new RegExp(regExp)
        let match = newReg.exec(seg)![1];
        const innerText = match ? match : "error";
        // console.log(match![1])
        transformed.push({
          content: innerText,
          shouldTransform: true,
        });
      } catch {
        console.error(regExp.exec(seg));
      }
    } else {
      transformed.push({
        content: seg,
        shouldTransform: false,
      });
    }
    // if (!seg) return;
    // if (regExp.test(seg)) {
    //   const matchResult = [...seg.matchAll(regExp)];
    //   const innerText = matchResult[0][1];
    //   transformed.push({
    //     content: innerText,
    //     shouldTransform: true,
    //   });
    //   // should transform
    // } else {
    //   transformed.push({
    //     content: seg,
    //     shouldTransform: false,
    //   });
    // }
  });
  return (
    // <Text>
    <Text>
      {transformed.map((item, index) => {
        if (item.shouldTransform) {
          return (
            <Text style={styles.highlightText} key={index}>
              {item.content}
            </Text>
          );
        } else {
          return (
            <Text style={styles.commonText} key={index}>
              {item.content}
            </Text>
          );
        }
      })}
    </Text>
    // </Text>
  );
  // const splited = text.split(regExp).filter((item) => item !== "");
};

export const SearchItemCard: React.FC<CardProps> = React.memo((props) => {
  const {
    id,
    watchCount,
    danmuCount,
    duration,
    avid,
    cid,
    title,
    coverUrl,
    upInfo,
  } = props;
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.push("Playing", {
      avid: id,
      cid: cid,
    });
  };
  return (
    // <View
    //   style={[
    //     styles.horizontalCardContainer,
    //     {
    //       width: "100%",
    //     },
    //   ]}
    // >
    <Pressable
      android_ripple={{
        radius: 350,
        foreground: true,
        borderless: false,
      }}
      style={[
        styles.horizontalCardContainer,
        { flexDirection: "row", width: "100%" },
      ]}
      onPress={handlePress}
    >
      <View style={styles.horizontalCoverContainer}>
        <Image
          source={{ uri: "http:" + coverUrl }}
          style={styles.horizontalCover}
        />
      </View>
      <View
        style={[
          styles.infoContainer,
          {
            flex: 1,
            paddingLeft: 12,
            // justifyContent: "space-between",
          },
        ]}
      >
        <Text
          style={[
            styles.titleText,
            {
              paddingVertical: 0,
              // alignItems: 'flex-start',
            },
          ]}
          numberOfLines={2}
        >
          {renderTitle(title)}
        </Text>
        <View style={styles.footContainer}>
          <View style={[styles.infoFooter, { marginTop: "auto" }]}>
            <View style={styles.upBadge}>
              <Text style={[tw`text-gray-500`, styles.badgeText]}>UP</Text>
            </View>
            <Text style={tw`text-gray-500 text-xs pl-1`}>{upInfo.name}</Text>
          </View>
          <View style={styles.infoFooter}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                // marginRight: "auto",
                flexDirection: "row",
                marginRight: "auto",
                marginLeft: 2,
              }}
            >
              <View style={styles.detailItem}>
                <Feather
                  name="youtube"
                  style={styles.detailItemIcon}
                  size={12}
                />
                <Text style={styles.detailItemText}>
                  {formatNum(watchCount)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="tv" style={styles.detailItemIcon} />
                <Text style={styles.detailItemText}>
                  {formatNum(danmuCount)}
                </Text>
              </View>
            </View>
            <AntDesign
              name="ellipsis1"
              color={"#9CA3AF"}
              size={13}
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </View>
        </View>
      </View>
    </Pressable>
    // </View>
  );
});

// const SearchItem = () => {
//   return (
//     <View>
//       <Text>SearchItem</Text>
//     </View>
//   );
// };

export default SearchItemCard;

const styles = StyleSheet.create({
  horizontalCardContainer: {
    // padding: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopColor: "#f4f5f7",
    borderTopWidth: 1,
    // paddingVertical: 8,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalCoverContainer: {
    width: HORIZONTAL_IMG_WIDTH,
    height: HORIZONTAL_IMG_HEIGHT,
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalCover: {
    width: HORIZONTAL_IMG_WIDTH,
    height: HORIZONTAL_IMG_HEIGHT,
  },
  infoContainer: {
    flex: 1,
    // height: '100%',
    // padding: 8,
    justifyContent: "space-between",
  },

  titleText: {
    color: "#000",
    fontSize: 13,
    // minHeight: 36,
  },
  footContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  infoFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 3,
    // marginTop: 'auto',
    // alignItem: 'flex-end',
    // paddintTop: 4,

    // paddingBottom: 2,
    // marginTop: 'auto',
  },
  upBadge: {
    borderRadius: 4,
    borderColor: "#9CA3AF",
    borderWidth: 1,
    color: "#9CA3AF",
    padding: 1,
    transform: [
      {
        scaleY: 0.7,
      },
      {
        scaleX: 0.8,
      },
      {
        translateY: 1,
      },
    ],
  },
  badgeText: {
    fontSize: 9,
  },
  detailItem: {
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  detailItemIcon: {
    color: "#9CA3AF",
    marginRight: 3,
  },
  detailItemText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  highlightText: {
    color: Colors.light.tint,
  },
  commonText: {},
});
