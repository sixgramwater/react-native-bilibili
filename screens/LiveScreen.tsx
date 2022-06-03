import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import LiveMessageList from "../feature/live/liveMessage";
import ScrollableTabs from "../components/scrollableTabView";
import { Entypo } from "@expo/vector-icons";
import VideoPlayer from "../components/videoPlayer";
import LiveVideoPlayer from "../components/videoPlayer/livePlayer";

const WIDTH = Dimensions.get("screen").width;

const LiveScreen = () => {
  const { roomid } = useRoute<any>().params;
  const streamUrl =
    "http://d1--cn-gotcha04.bilivideo.com/live-bvc/586247/live_434401868_11020491_1500.flv?cdn=cn-gotcha04&expires=1654251218&len=0&oi=1972571353&pt=&qn=150&trid=10007a1134ba508e4225a4c953cf204265e1&sigparams=cdn,expires,len,oi,pt,qn,trid&sign=29cd2e2fda06cd61896bd54cfd5a6918&ptype=0&src=8&sl=3&source=one&sk=2935686d6cb9146c7a6a6a0b4e120e250342be3df4dc8310261aab0ce9e21e44&order=2";
  // useEffect(() => {
  const m3u8 =
    "http://cn-zjhz-cmcc-v-23.bilivideo.com/live-bvc/351549/live_434401868_11020491_1500.m3u8?cdn=cn-gotcha01&expires=1654252970&len=0&oi=1972571353&pt=h5&qn=150&trid=1003f235eef836c1430bb8e688286b602d26&sigparams=cdn,expires,len,oi,pt,qn,trid&sign=cb7b6946dfc1838c2c8a3c5d33f32c86&ptype=0&src=8&sl=3&source=one&sid=11317&sk=2935686d6cb9146c7a6a6a0b4e120e250342be3df4dc8310261aab0ce9e21e44&order=2";
  // }, [])
  const tabs = [
    {
      id: 0,
      name: "聊天",
      screen: "message",
      component: <LiveMessageList roomid={roomid} />,
    },
    {
      id: 1,
      name: "房间信息",
      screen: "comment",
      component: <Text>房间号：{roomid}</Text>,
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#000" style="light"/>
      <View style={{ flex: 1 }}>
        <View style={styles.videoContainer}>
          <LiveVideoPlayer src={m3u8} showDanmu={false} />
        </View>
        <View style={styles.infoContainer}>
          <ScrollableTabs tabs={tabs} />
        </View>
        <KeyboardAvoidingView style={styles.bottomInputContainer}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 12,
            }}
          ></View>
          <TextInput style={styles.input} placeholder="发送消息" />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 12,
            }}
          >
            <Entypo name="dots-three-vertical" color="#000" size={16} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default LiveScreen;

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    height: (WIDTH * 9) / 16,
    backgroundColor: "#000",
    position: "relative",
  },

  infoContainer: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  bottomInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f7f7f7",

    // height: 36,
    // paddingVertical: 8,
    // backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    // paddingBottom: 6,
  },

  input: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#eaeaea",
    borderRadius: 4,
    flex: 1,
    // marginLeft: 36,
  },
});
