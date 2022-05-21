import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import Card, { CardProps } from "../components/card";
import Colors from "../constants/Colors";
import { fetchHomeRecommend } from "../api";
// import { ListItemType } from "../types";
// import {  } from "../types";

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

const banners = [
  {
    id: 0,
    imgUrl:
      "https://i.picsum.photos/id/947/400/200.jpg?hmac=y_jux1LcWLTt1CkBkgcxs8E1SnlJU-JQ9pXmwGTQX3I",
    text: "show Under the img 0",
  },
  {
    id: 1,
    imgUrl:
      "https://i.picsum.photos/id/117/400/200.jpg?hmac=C0V4p3qjR5xEX-jLumDMvom9aBauL505OREHwPACbGo",
    text: "show Under the img 1",
  },
  {
    id: 2,
    imgUrl:
      "https://i.picsum.photos/id/1072/400/200.jpg?hmac=fTCm21OaMprwrpOgKj7mIUgq4kMLtOePZMmG__-4Kd0",
    text: "show Under the img 2",
  },
  {
    id: 3,
    imgUrl:
      "https://i.picsum.photos/id/914/400/200.jpg?hmac=sgPF7tMIJ5LUgL5o_gEvXBtYya2aKv2xSxXene7zqdM",
    text: "show Under the img 3",
  },
];

const cards = [
  {
    id: 0,
    watchCount: 15000,
    danmuCount: 1320,
    duration: 1300,
    title: "Leclare: F1 2022, 立本！没有你 我怎么活啊啊啊啊！？aasdadsdas",
    coverUrl:
      "https://i.picsum.photos/id/560/400/300.jpg?hmac=kpc5KnGg6YAe-ULUPyFpLIKMeNVEY-kM1I1qwD-ydp4",
    upInfo: {
      id: 100,
      name: "sixgramwater",
    },
  },
];

const WIDTH = Dimensions.get("screen").width;

const listData = new Array(10).fill(0).map((_, i) => i);

const RecScreen = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState<CardProps[]>([]);
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = () => {
    return fetchHomeRecommend().then((res) => {
      const list: ListItemType[] = res.data.item;
      const mappedList = list.map((item: ListItemType) => {
        const cardProp: CardProps = {
          id: item.id,
          avid: item.id,
          cid: item.cid,
          coverUrl: item.pic,
          // imgUrl: item.pic,
          title: item.title,
          duration: item.duration,
          watchCount: item.stat.view,
          danmuCount: item.stat.danmaku,
          upInfo: {
            id: item.owner.mid,
            name: item.owner.name,
          },
        };
        return cardProp;
      });
      setList(mappedList);
    });
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    })
    // fetchHomeRecommend().then((res) => {
    //   const list: ListItemType[] = res.data.item;
    //   const mappedList = list.map((item: ListItemType) => {
    //     const cardProp: CardProps = {
    //       id: item.id,
    //       coverUrl: item.pic,
    //       // imgUrl: item.pic,
    //       title: item.title,
    //       duration: item.duration,
    //       watchCount: item.stat.view,
    //       danmuCount: item.stat.danmaku,
    //       upInfo: {
    //         id: item.owner.mid,
    //         name: item.owner.name,
    //       },
    //     };
    //     return cardProp;
    //   });
    //   console.log(mappedList);
    //   setList(mappedList);
    // });
  };
  return (
    // <SafeAreaView>
    <ScrollView
      style={{ flex: 1, padding: 12 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.light.tint]}
        />
      }
    >
      <View style={styles.swiperContainer}>
        <PagerView
          style={{ flex: 1 }}
          showPageIndicator={true}
          onPageSelected={(e) => setActiveItem(e.nativeEvent.position)}
          ref={pagerRef}
        >
          {banners.map((item) => {
            return (
              <View style={styles.bannerItem} key={item.id}>
                <Image source={{ uri: item.imgUrl }} style={styles.bannerImg} />
                <Text style={styles.bannerText}>{item.text}</Text>
              </View>
            );
          })}
        </PagerView>
        {/* <View><Text>{item}</Text></View> */}
        <View style={styles.indicator}>
          {banners.map((item) => (
            <View
              key={item.id}
              style={[styles.dot, activeItem === item.id && styles.activeDot]}
            ></View>
          ))}
        </View>
      </View>
      <View style={styles.listContainer}>
        {list.map((item) => (
          // <Pressable key={index} android_ripple={{
          //   radius: 150,
          //   foreground: true,
          //   borderless: false,
          // }}>
          <Card {...item} key={item.id} />
          // {/* </Pressable> */}
        ))}
        {/* <Card {...cards[0]} />
        <Card {...cards[0]} /> */}
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
};

export default RecScreen;

const styles = StyleSheet.create({
  swiperContainer: {
    height: 200,
    // width: '100%',
    // backgroundColor: "red",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  bannerItem: {
    width: WIDTH,
    height: 200,
  },
  bannerImg: {
    width: WIDTH,
    height: 200,
  },
  bannerText: {},
  indicator: {
    position: "absolute",
    right: 12,
    bottom: 12,
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#ffffff90",
    marginHorizontal: 3,
    // marginVertical: 10,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});
