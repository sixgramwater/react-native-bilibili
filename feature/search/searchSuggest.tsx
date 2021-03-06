import { Dimensions, Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import tw from "twrnc";
import { store_get, STORE_KEYS, store_set } from "../../utils/store";
import { fetchTrends } from "../../api";

const WIDTH = Dimensions.get("screen").width;

const HistoryItem = ({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) => {
  const handlePress = () => {
    onPress && onPress();
  };
  return (
    <Pressable onPress={handlePress}>
      <Text style={styles.blockItem}>{title}</Text>
    </Pressable>
  );
};

type hotlistItem = {
  keyword: string;
  show_name: string;
  icon?: string | null;
};

const SearchSuggest = React.memo(
  ({ onPress }: { onPress?: (keyword: string) => void }) => {
    const [hotlist, setHotlist] = useState<hotlistItem[]>([]);
    const [historyList, setHistoryList] = useState<string[]>([]);
    useEffect(() => {
      store_get(STORE_KEYS.SEARCH_HISTORY).then((value: any[] | undefined) => {
        if (!value || value.length === 0) {
          console.log("No history data!");
        } else {
          let sorted = value;
          // sorted.reverse();
          setHistoryList(sorted.reverse());
        }

        // console.log(value);
        // setHistoryList(value);
      });
    }, []);
    const fetchTrendsData = () => {
      return fetchTrends()
        .then((res) => {
          const list = res.data.trending?.list;
          const mappedList = list?.map((item: any) => {
            return {
              keyword: item.keyword,
              show_name: item.show_name,
              icon: item.icon === "" ? null : item.icon,
            };
          });
          setHotlist(mappedList);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    useEffect(() => {
      fetchTrendsData();
    }, []);
    const handleDeleteHistory = () => {
      store_set(STORE_KEYS.SEARCH_HISTORY, []);
      setHistoryList([]);
    };
    const handleClickHistory = (item: string) => {
      onPress && onPress(item);
    };
    return (
      <View style={{ flex: 1, padding: 12, backgroundColor: "#fff" }}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>??????</Text>
          <View style={styles.hotlist}>
            {hotlist.length === 0 ? (
              <Text>??????????????????</Text>
            ) : (
              hotlist?.map((item, index) => (
                <View style={styles.hotItem} key={index}>
                  <Text style={styles.index}>{index + 1}</Text>
                  <Text numberOfLines={1}>{item.show_name}</Text>
                  {item.icon && (
                    <Image
                      style={{ width: 14, height: 14, marginLeft: 4 }}
                      source={{uri: item.icon}}
                    />
                  )}
                </View>
              ))
            )}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>????????????</Text>
          <View style={styles.blockContainer}>
            {historyList.length === 0 ? (
              <Text style={tw`text-gray-600 pt-4 pb-5`}>??????????????????</Text>
            ) : (
              historyList.map((item, index) => (
                <HistoryItem
                  key={index}
                  title={item}
                  onPress={() => handleClickHistory(item)}
                />
              ))
            )}
            {/* <HistoryItem title="LGD" />
          <HistoryItem title="TI10" />
          <HistoryItem title="Dota2" /> */}
          </View>
          {historyList.length > 0 && (
            <Pressable
              style={styles.blockControl}
              onPress={handleDeleteHistory}
            >
              <Feather name="trash-2" style={tw`text-gray-500`} />
              <Text
                style={[tw`text-gray-500`, { fontSize: 13, marginLeft: 8 }]}
              >
                ??????????????????
              </Text>
            </Pressable>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>????????????</Text>
          <View style={styles.blockContainer}>
            <HistoryItem title="LGD" />
            <HistoryItem title="TI10" />
            <HistoryItem title="Dota2" />
          </View>
          {/* <Pressable style={styles.blockControl}>
          <Feather name="trash-2" style={{}} />
          <Text>??????????????????</Text>
        </Pressable> */}
        </View>
        {/* <Text>SearchSuggest</Text> */}
      </View>
    );
  }
);

export default SearchSuggest;

const styles = StyleSheet.create({
  sectionContainer: {},
  sectionTitle: {
    color: "#000",
    fontWeight: "600",
  },
  hotlist: {
    marginTop: 12,
    marginBottom: 24,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  hotItem: {
    flexDirection: "row",
    paddingVertical: 6,
    width: WIDTH / 2 - 12,
    alignItems: 'center',
  },
  index: {
    marginRight: 8,
    fontWeight: "700",
  },
  blockContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 12,
  },
  blockItem: {
    backgroundColor: "#f6f7f8",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 13,
    marginRight: 16,
    marginBottom: 10,
  },
  blockControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
});
