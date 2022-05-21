import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScrollableTabs from "../../../components/scrollableTabView";
import { CardProps } from "../../../components/card";
import SearchItemCard from "./searchItem";
import { fetchSearchDefault } from "../../../api";
import Colors from "../../../constants/Colors";

const SearchPage = React.memo(
  ({ type, keyword }: { type: number; keyword: string }) => {
    const [list, setList] = useState<CardProps[]>([]);
    const loading = list.length === 0;
    useEffect(() => {
      if (!keyword) return;
      fetchSearchDefault(keyword).then((res) => {
        // console.log(res)

        const result = res.data.result;
        const videoResult = result.filter(
          (item: any) => item.result_type === "video"
        ).pop();
        // console.log(videoResult.data);
        const videoList = videoResult.data.map((item: any) => {
          const mappedItem: CardProps = {
            id: item.aid,
            avid: item.aid,
            cid: item.cid ? item.cid : -1,
            watchCount: item.play,
            danmuCount: item.danmaku,
            title: item.title,
            duration: item.duration,
            coverUrl: item.pic,
            upInfo: {
              id: item.mid,
              name: item.author,
            },
          };
          return mappedItem;
          // setList(mappedList);
        });
        setList(videoList);
      }).catch(err => {
        console.log(err);
      })
    }, [type, keyword]);
    return (
      <View style={{ flex: 1 }}>
        {/* <ScrollableTabs /> */}
        {loading ? (
          <ActivityIndicator size='large' color={Colors.light.tint}/>
          // <Text>暂无搜索记录</Text>
        ) : (
          <FlatList
            data={list}
            renderItem={({ item }) => <SearchItemCard {...item} />}
          />
        )}
      </View>
    );
  }
);

const SearchList = React.memo(({ keyword }: { keyword: string }) => {
  const tabs = [
    {
      id: 0,
      name: "综合",
      screen: "default",
      ref: React.createRef<View>(),
      component: <SearchPage type={0} keyword={keyword} />,
    },
    {
      id: 1,
      name: "番剧",
      screen: "default",
      ref: React.createRef<View>(),
      component: <SearchPage type={0} keyword={keyword} />,
    },
    {
      id: 2,
      name: "直播",
      screen: "default",
      ref: React.createRef<View>(),
      component: <SearchPage type={0} keyword={keyword} />,
    },
    {
      id: 3,
      name: "用户",
      screen: "default",
      ref: React.createRef<View>(),
      component: <SearchPage type={0} keyword={keyword} />,
    },
    // {
    //   id:
    // }
  ];
  return (
    <View style={{ flex: 1 }}>
      <ScrollableTabs
        tabs={tabs}
        tabsContainerStyle={{
          backgroundColor: Colors.light.tint,
          elevation: 0,
        }}
        tabTextStyle={{ color: "#ffffff8b" }}
        tabTextActivatedStyle={{ color: "#fff", fontWeight: "500" }}
        indicatorStyle={{ backgroundColor: "#fff" }}
      />
      {/* <Text>SearchList</Text> */}
    </View>
  );
});

export default SearchList;

const styles = StyleSheet.create({});
