import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import ScrollableTabs from "../components/scrollableTabView";
import PlayingInfo from "../feature/playing/PlayingInfo";
import VideoPlayer from "../components/videoPlayer";
import { fetchDanmuXml, fetchVideoUrl, fetchVideoUrlNoReferer } from "../api";
import ReplyInfo from "../feature/reply/replyInfo";
import axios from "axios";

const WIDTH = Dimensions.get("screen").width;

const PlayingScreen = () => {
  const navigation = useNavigation();
  const { avid, cid: initCid } = useRoute<any>().params;
  const [cid, setCid] = useState(initCid);
  const [url, setUrl] = useState<string | undefined>();
  // const provider = useRef();
  const handleSetCid = (cid: number) => {
    setCid(cid);
  };
  // const replyCount =
  const fetchVideo = () => {
    console.log("fetchUrl from avid, cid", avid, cid);
    if (cid === -1) return;
    return fetchVideoUrlNoReferer(avid, cid)
      .then((res) => {
        // console.log(res);
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

  const fetchDanmuData = () => {
    if(cid === -1)  return;
    fetchDanmuXml(cid).then(data => {
      console.log(data);
    }).then(err => {
      console.log(err);
    }).catch(err => {
      console.log(err);
    })
    // axios.get('https://gist.githubusercontent.com/Pavneet-Sing/d0f3324f2cd3244a6ac8ffc5e8550102/raw/8ebc801b3e4d4987590958978ae58d3f931193a3/XMLResponse.xml')
    // .then(value => {
    //   console.log(value);
    // })
    // return axios.get(`http://api.bilibili.com/x/v1/dm/list.so`, {
    //   // responseType: 'text',
    //   responseEncoding: 'UTF-8',
    //   params: {
    //     oid: cid
    //   }
    //   // decompress: true,
    //   // responseType: 'text',
    // }).then(data => {
    //   // data.
    //   console.log(data.data);
    // }).catch(err => {
    //   console.log(err);
    // })
    // provider.c = new CommentProvider();
    // provider.addStaticSource();
  }

  useEffect(() => {
    // console.log(avid, cid);
    fetchVideo();
    // fetchDanmuData();
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
        {/* <View style={styles.header}>
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
        </View> */}
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
  
  infoContainer: {
    flex: 1,
  },
});
