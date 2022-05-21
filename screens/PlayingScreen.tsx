import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import ScrollableTabs from "../components/scrollableTabView";
import PlayingInfo from "../feature/playing/PlayingInfo";
import VideoPlayer from "../components/videoPlayer";
import { fetchVideoUrl, fetchVideoUrlNoReferer } from "../api";
import ReplyInfo from "../feature/reply/replyInfo";

const WIDTH = Dimensions.get("screen").width;

const PlayingScreen = () => {
  const navigation = useNavigation();
  const { avid, cid: initCid } = useRoute<any>().params;
  const [cid, setCid] = useState(initCid);
  const [url, setUrl] = useState<string | undefined>();
  const handleSetCid = (cid: number) => {
    setCid(cid);
  };
  // const replyCount =
  const fetchVideo = () => {
    console.log("fetchUrl from avid, cid", avid, cid);
    if (cid === -1) return;
    return fetchVideoUrlNoReferer(avid, cid)
      .then((res) => {
        console.log(res);
        const urlList = res.data.durl;
        // console.log(res);
        // console.log(urlList[0].url, urlList[0].backup_url);
        setUrl(urlList[0].url);
      })
      .catch((err) => {
        console.log(err);
        console.error(err);
      });
  };
  useEffect(() => {
    // console.log(avid, cid);
    fetchVideo();
  }, [avid, cid]);
  const tabs = [
    {
      id: 0,
      name: "简介",
      screen: "desc",
      component: <PlayingInfo aid={avid} onLoadCid={handleSetCid} />,
    },
    {
      id: 1,
      name: "评论",
      screen: "comment",
      component: <ReplyInfo avid={avid} />,
    },
  ];
  // const {  } = navigation.
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#000" />
      <View style={{ flex: 1 }}>
        <View style={styles.videoContainer}>
          <VideoPlayer src={url} />
        </View>
        <View style={styles.header}>
          <Pressable
            android_ripple={{
              radius: 14,
              foreground: true,
              borderless: true,
              color: "rgba(255,255,255,0.3)",
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign
              color={"#fff"}
              name="arrowleft"
              size={24}
              style={styles.backButton}
            />
          </Pressable>
          <View>
            <Pressable
              android_ripple={{
                radius: 14,
                foreground: true,
                borderless: true,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <AntDesign
                color={"#fff"}
                name="ellipsis1"
                size={24}
                style={[
                  {
                    transform: [{ rotate: "90deg" }],
                  },
                ]}
              />
            </Pressable>
          </View>
          {/* <Text>123</Text> */}
        </View>
        <View style={styles.infoContainer}>
          <ScrollableTabs tabs={tabs} />
          {/* <Text>PlayingScreen</Text>
          <Text>{avid + ", " + cid}</Text> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlayingScreen;

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    height: (WIDTH * 9) / 16,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    // left: 0,
    // display: "flex",
    flexDirection: "row",
    height: 36,
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#fff",
  },
  backButton: {},
  infoContainer: {
    flex: 1,
  },
});
