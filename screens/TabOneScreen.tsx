import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
// import CookieManager from "@react-native-cookies/cookies";
import { Button } from "react-native-elements";
import { fetchUserNav } from "../api";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {

  const handleClick = () => {

    fetchUserNav().then(res => {
      console.log(res);
    })
  }
  // const handleClick = () => {
  //   CookieManager.get("bilibili.com").then((value) => {
  //     console.log(value);
  //   });
  // };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab One</Text> */}
      <Button onPress={handleClick} title="click" />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
