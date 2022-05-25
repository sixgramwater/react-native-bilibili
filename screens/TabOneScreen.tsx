import { Dimensions, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
// import CookieManager from "@react-native-cookies/cookies";
import { Button } from "react-native-elements";
import { fetchUserNav } from "../api";
import Danmu from "../components/danmu";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = (WIDTH / 16) * 9;
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [playing, setPlaying] = useState(false);
  const handleClick = () => {
    setPlaying((status) => !status);
    // fetchUserNav().then((res) => {
    //   console.log(res);
    // });
  };
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
          <Danmu isPlaying={playing} />
          {/* <View style={[StyleSheet.absoluteFill]}>
          // <Danmu />
        </View> */}
        </View>
        {/* <Text style={styles.title}>Tab One</Text> */}
        <Button onPress={handleClick} title="click" />
        <Text>isPlaying: {playing ? "true" : "false"}</Text>
        {/* <View
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
