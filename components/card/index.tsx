import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatNum } from "../../utils/index";
const WIDTH = Dimensions.get("screen").width;
const SPACING = 12;
const CARD_WIDTH = (WIDTH - 3 * SPACING) / 2;

const HORIZONTAL_IMG_HEIGHT = 70;
const HORIZONTAL_IMG_WIDTH = (HORIZONTAL_IMG_HEIGHT * 16) / 9;

export type CardProps = {
  id: number;
  avid: number;
  cid: number;
  watchCount: number;
  danmuCount: number;
  duration: number;
  title: string;
  coverUrl: string;
  upInfo: {
    id: number;
    name: string;
  };
};

// export type HorizontalCardProps = CardProps & {

// }

export const HorizontalCard: React.FC<CardProps> = React.memo((props) => {
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
        <Image source={{ uri: coverUrl }} style={styles.horizontalCover} />
      </View>
      <View
        style={[
          styles.infoContainer,
          {
            flex: 1,
            paddingLeft: 12,
            justifyContent: "space-between",
          },
        ]}
      >
        <Text
          style={[
            styles.titleText,
            {
              paddingVertical: 0,
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <View style={styles.infoFooter}>
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
            }}
          >
            <View style={styles.detailItem}>
              <Feather name="youtube" style={styles.detailItemIcon} size={12} />
              <Text style={styles.detailItemText}>{formatNum(watchCount)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="tv" style={styles.detailItemIcon} />
              <Text style={styles.detailItemText}>{formatNum(danmuCount)}</Text>
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
    </Pressable>
    // </View>
  );
});

const Card: React.FC<CardProps> = (props) => {
  const { id, watchCount, duration, avid, cid, title, coverUrl, upInfo } =
    props;
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("Playing", {
      avid: id,
      cid: cid,
    });
  };

  return (
    <View style={[styles.cardContainer]}>
      <Pressable
        android_ripple={{
          radius: 150,
          foreground: true,
          borderless: false,
        }}
        onPress={handlePress}
      >
        <View style={[styles.coverContainer]}>
          <Image source={{ uri: coverUrl }} style={styles.cover} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.titleText} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.infoFooter}>
            <View style={styles.upBadge}>
              <Text style={[tw`text-gray-500`, styles.badgeText]}>UP</Text>
            </View>
            <Text style={tw`text-gray-500 text-xs pl-1`}>{upInfo.name}</Text>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
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
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 5,
    overflow: "hidden",
    elevation: 1,
    backgroundColor: "#fff",
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  horizontalCardContainer: {
    borderTopColor: "#f4f5f7",
    borderTopWidth: 1,
    // paddingVertical: 8,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  coverContainer: {
    width: CARD_WIDTH,
    height: (CARD_WIDTH * 9) / 16,
  },
  horizontalCoverContainer: {
    width: HORIZONTAL_IMG_WIDTH,
    height: HORIZONTAL_IMG_HEIGHT,
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalCover: {
    width: HORIZONTAL_IMG_WIDTH,
    height: HORIZONTAL_IMG_HEIGHT,
  },
  cover: {
    width: CARD_WIDTH,
    height: (CARD_WIDTH * 9) / 16,
  },
  infoContainer: {
    padding: 8,
  },

  titleText: {
    color: "#000",
    fontSize: 13,
    minHeight: 36,
  },
  infoFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddintTop: 4,
    // paddingBottom: 2,
    marginTop: 4,
  },
  upBadge: {
    borderRadius: 4,
    borderColor: "#9CA3AF",
    borderWidth: 1,
    color: "#9CA3AF",
    padding: 1,
    transform: [
      {
        scaleY: 0.75,
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
});
