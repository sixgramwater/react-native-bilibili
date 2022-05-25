import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { fetchRelatedVideos, fetchVideoInfo } from "../../api";
import { RecommendVideoInfo, VideoInfo } from "./type";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import Colors from "../../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { CardProps, HorizontalCard } from "../../components/card";
// import { Transition, Transitioning, TransitioningView } from "react-native-reanimated";

export type PlayingInfoType = Partial<VideoInfo>;

// const transition = (
//   <Transition.Together>
//     <Transition.In type="fade" durationMs={200}/>
//     <Transition.Change />
//     <Transition.Out type="fade" durationMs={200}/>
//   </Transition.Together>
// )

export const formatNum = (num?: number) => {
  if (num === undefined) return "";
  let res = "";
  if (num >= 10000) {
    res += (num / 10000).toFixed(1) + "万";
  } else {
    res = num.toString();
  }
  return res;
};

export const formatDate = (date?: number) => {
  if (date === undefined) return "";
  const dateString = new Date(date * 1000).toISOString();
  return dateString.substring(0, 10) + " " + dateString.substring(11, 16);
};

const PlayingInfo = ({
  aid,
  onLoadCid,
}: {
  aid: number;
  onLoadCid?: (cid: number) => void;
}) => {
  const [info, setInfo] = useState<PlayingInfoType>();
  // const infoRef = useRef<TransitioningView>(null);
  const [relatedList, setRelatedList] = useState<RecommendVideoInfo[]>([]);
  const mappedCardList: CardProps[] = !relatedList
    ? []
    : relatedList.map((item) => {
        return {
          id: item.aid,
          avid: item.aid,
          cid: item.cid,
          watchCount: item.stat.view,
          danmuCount: item.stat.danmaku,
          title: item.title,
          duration: item.duration,
          coverUrl: item.pic,
          upInfo: {
            id: item.owner.mid,
            name: item.owner.name,
          },
        };
      });
  const [collapsed, setCollapsed] = useState(true);
  const fetchData = () => {
    return fetchVideoInfo(aid)
      .then((res) => {
        const videoInfo: VideoInfo = res.data;
        const cid = videoInfo.cid;
        setInfo(videoInfo);
        onLoadCid && onLoadCid(cid);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const fetchRelatedList = () => {
    return fetchRelatedVideos(aid)
      .then((res) => {
        // console.log(res);
        const recommendVideoList: RecommendVideoInfo[] = res.data;
        // console.log(recommendVideoList);
        setRelatedList(recommendVideoList);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchData();
    fetchRelatedList();
  }, [aid]);

  const handleToggleCollapse = () => {
    // infoRef.current?.animateNextTransition();
    setCollapsed(status => !status);
  }
  const renderInfo = () => (
    <View style={styles.info}>
      <View style={styles.infoHeader}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: info?.owner?.face,
            }}
          />
        </View>
        <View style={styles.upInfo}>
          <Text style={styles.upName}>{info?.owner?.name}</Text>
          <Text style={[styles.upDetail, tw`text-gray-500`]}>
            20.2万粉丝 1016视频
          </Text>
        </View>
        <View style={styles.followButton}>
          <Feather name="plus" size={18} color={"#fff"} />
          <Text style={{ color: "#fff" }}>关注</Text>
        </View>
      </View>
      <View style={styles.infoContent}>
        <View style={styles.title}>
          <TouchableWithoutFeedback
            onPress={handleToggleCollapse}
          >
            <Text style={styles.titleText} numberOfLines={collapsed ? 1 : 3}>
              {info?.title}
            </Text>
          </TouchableWithoutFeedback>
          <View style={styles.arrowBtn}>
            <TouchableWithoutFeedback
              onPress={handleToggleCollapse}
            >
              <Feather
                name={collapsed ? "chevron-up" : "chevron-down"}
                size={20}
                color={"#95989d"}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.littleDetail}>
          <View style={styles.detailItem}>
            <Feather name="youtube" style={styles.detailItemIcon} size={12} />
            <Text style={styles.detailItemText}>
              {formatNum(info?.stat?.view)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="tv" style={styles.detailItemIcon} />
            <Text style={styles.detailItemText}>
              {formatNum(info?.stat?.danmaku)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailItemText}>
              {formatDate(info?.pubdate)}
            </Text>
          </View>
        </View>
        {!collapsed && (
          <View style={styles.expandInfoContainer}>
            <Text style={{ fontSize: 12, color: "#95989d", marginBottom: 6 }}>
              {info?.bvid}
            </Text>
            <Text style={{ fontSize: 12, color: "#95989d" }}>{info?.desc}</Text>
          </View>
        )}
      </View>
      <View style={styles.infoBtns}>
        <View style={styles.infoBtn}>
          <Feather color={"#757575"} size={20} name="thumbs-up" />
          <Text style={styles.infoBtnText}>{formatNum(info?.stat?.like)}</Text>
        </View>
        <View style={styles.infoBtn}>
          <Feather color={"#757575"} size={20} name="thumbs-down" />
          <Text style={styles.infoBtnText}>不喜欢</Text>
        </View>
        <View style={styles.infoBtn}>
          <FontAwesome5 color={"#757575"} size={20} name="bowling-ball" />
          <Text style={styles.infoBtnText}>{formatNum(info?.stat?.coin)}</Text>
        </View>
        <View style={styles.infoBtn}>
          <FontAwesome5 color={"#757575"} size={20} name="star" />
          <Text style={styles.infoBtnText}>
            {formatNum(info?.stat?.favorite)}
          </Text>
        </View>
        <View style={styles.infoBtn}>
          <FontAwesome5 color={"#757575"} size={20} name="share" />
          <Text style={styles.infoBtnText}>{formatNum(info?.stat?.share)}</Text>
        </View>
      </View>
    </View>
  );
  return (
    <FlatList
      data={mappedCardList}
      style={styles.infoContainer}
      renderItem={({ item }) => <HorizontalCard {...item} />}
      ListHeaderComponent={() => renderInfo()}
    >
      {/* <View style={styles.info}>
        <View style={styles.infoHeader}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{
                uri: info?.owner?.face,
              }}
            />
          </View>
          <View style={styles.upInfo}>
            <Text style={styles.upName}>{info?.owner?.name}</Text>
            <Text style={[styles.upDetail, tw`text-gray-500`]}>
              20.2万粉丝 1016视频
            </Text>
          </View>
          <View style={styles.followButton}>
            <Feather name="plus" size={18} color={"#fff"} />
            <Text style={{ color: "#fff" }}>关注</Text>
          </View>
        </View>
        <View style={styles.infoContent}>
          <View style={styles.title}>
            <Text style={styles.titleText} numberOfLines={collapsed ? 1 : 3}>
              {info?.title}
            </Text>
            <View style={styles.arrowBtn}>
              <Feather name="chevron-down" size={20} color={"#9CA3AF"} />
            </View>
          </View>
          <View style={styles.littleDetail}>
            <View style={styles.detailItem}>
              <Feather name="youtube" style={styles.detailItemIcon} size={12} />
              <Text style={styles.detailItemText}>
                {formatNum(info?.stat?.view)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="tv" style={styles.detailItemIcon} />
              <Text style={styles.detailItemText}>
                {formatNum(info?.stat?.danmaku)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemText}>
                {formatDate(info?.pubdate)}
              </Text>
            </View>
          </View>
          <View style={styles.title}></View>
        </View>
        <View style={styles.infoBtns}>
          <View style={styles.infoBtn}>
            <Feather color={"#757575"} size={20} name="thumbs-up" />
            <Text style={styles.infoBtnText}>
              {formatNum(info?.stat?.like)}
            </Text>
          </View>
          <View style={styles.infoBtn}>
            <Feather color={"#757575"} size={20} name="thumbs-down" />
            <Text style={styles.infoBtnText}>不喜欢</Text>
          </View>
          <View style={styles.infoBtn}>
            <FontAwesome5 color={"#757575"} size={20} name="bowling-ball" />
            <Text style={styles.infoBtnText}>
              {formatNum(info?.stat?.coin)}
            </Text>
          </View>
          <View style={styles.infoBtn}>
            <FontAwesome5 color={"#757575"} size={20} name="star" />
            <Text style={styles.infoBtnText}>
              {formatNum(info?.stat?.favorite)}
            </Text>
          </View>
          <View style={styles.infoBtn}>
            <FontAwesome5 color={"#757575"} size={20} name="share" />
            <Text style={styles.infoBtnText}>
              {formatNum(info?.stat?.share)}
            </Text>
          </View>
        </View>
      </View> */}

      {/* <View style={styles.relatedContainer}>
        <FlatList
          style={{ flex: 1 }}
          data={mappedCardList}
          ListHeaderComponent={}
          // keyExtractor={(item, index) => index}
          renderItem={({ item }) => <HorizontalCard {...item} />}
        />
      </View> */}
      {/* <Text>PlayingInfo</Text> */}
    </FlatList>
  );
};

export default PlayingInfo;

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderTopColor: "#f4f5f7",
    borderTopWidth: 1,
    // elevation: 0,
    // marginTop: 6,
  },
  info: {
    paddingBottom: 20,
    // backgroundColor: '#fff',
  },
  infoHeader: {
    paddingVertical: 6,
    flexDirection: "row",
    // backgroundColor: '#fff',
  },

  avatarContainer: {
    height: 36,
    width: 36,
    borderRadius: 36,
    overflow: "hidden",
  },
  avatar: {
    height: 36,
    width: 36,
  },
  upInfo: {
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  upName: {
    color: Colors.light.tint,
    fontWeight: "600",
  },
  upDetail: {
    fontSize: 11,
    // color: ;
  },
  followButton: {
    marginLeft: "auto",
    paddingVertical: 0,
    marginVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.tint,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
  },
  infoContent: {},
  title: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    // fontSize: 18,
  },
  arrowBtn: {
    marginLeft: "auto",
    alignSelf: "flex-start",
  },
  titleText: {
    flex: 1,
    color: "#000",
    fontSize: 16,
  },
  littleDetail: {
    flexDirection: "row",
    // paddingLeft: 12,
  },
  detailItem: {
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  detailItemIcon: {
    color: "#95989d",
    marginRight: 3,
  },
  detailItemText: {
    fontSize: 11,
    color: "#95989d",
  },
  expandInfoContainer: {
    paddingVertical: 6,
    // paddingVertical: 8,
    flexGrow: 1,
  },
  infoBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 6,
    // paddingHorizontal: 8,
  },
  infoBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoBtnText: {
    color: "#757575",
    fontSize: 12,
    marginTop: 6,
  },
  relatedContainer: {
    flex: 1,
  },
});
