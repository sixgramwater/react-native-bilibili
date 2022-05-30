import { Dimensions, StyleSheet, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
// import CookieManager from "@react-native-cookies/cookies";
import { Button } from "react-native-elements";
import { fetchDanmuXml, fetchUserNav } from "../api";
import Danmu, { DanmakuRef, DanmuType } from "../components/danmu";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { parseDanmuToJSON } from "../utils";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = (WIDTH / 16) * 9;
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [playing, setPlaying] = useState(false);
  const danmukuRef = useRef<DanmakuRef>(null);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<DanmuType[]>([]);
  const handleClick = () => {
    // setPlaying((status) => !status);
    // fetchUserNav().then((res) => {
    //   console.log(res);
    // });
  };
  useEffect(() => {
    // const cid = 723864662;
    // fetchDanmuXml(cid)
    //   .then((value) => {
    //     const list = parseDanmuToJSON(value);
    //     const sortedList = list
    //       .slice(0, 400)
    //       .sort((a, b) => a.startTime - b.startTime)
    //       .map((item) => {
    //         return { ...item, startTime: item.startTime * 1000 };
    //       });
    //     // console.log(list.length);
    //     console.log(sortedList);
    //     setData(sortedList);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);
  // const handleClick = () => {
  //   CookieManager.get("bilibili.com").then((value) => {
  //     console.log(value);
  //   });
  // };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            height: HEIGHT,
            width: WIDTH,
            position: "relative",
            backgroundColor: "#000",
          }}
        >
          <Danmu ref={danmukuRef} data={data} />
          {/* <View style={[StyleSheet.absoluteFill]}>
          // <Danmu />
        </View> */}
        </View>
        {/* <Text style={styles.title}>Tab One</Text> */}
        <Button onPress={() => danmukuRef.current?.play()} title="play" />
        <Button onPress={() => danmukuRef.current?.pause()} title="pause" />
        <Text>isPlaying: {playing ? "true" : "false"}</Text>
        <Button
          onPress={() => danmukuRef.current?.seek(Number(inputValue))}
          title="seekTo: "
        />
        <TextInput
          value={inputValue}
          onChange={(e) => setInputValue(e.nativeEvent.text)}
        />
        <Button
          onPress={() => danmukuRef.current?.send({ id: 0 } as any)}
          title="send"
        />
        {/* <Vie
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
