import { Dimensions, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { WebView } from "react-native-webview";
import QrcodeLogin from "../feature/login/qrcode";
const WIDTH = Dimensions.get('screen').width;
// const myHTMLFile = require('../assets/loginWeb/index.html')


export default function TabTwoScreen() {
  return (
    <QrcodeLogin/>
    // <View style={styles.container}>
    //   <Text style={styles.title}>Tab Two</Text>
    //   <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    //   <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    // </View>
    // <WebView
    //   style={styles.container}
    //   source={{uri: 'file:///android_asset/loginWeb/index.html'}}
    //   onMessage={(event) => {
    //     console.log(event.nativeEvent.data);
        
    //   }}
    //   allowUniversalAccessFromFileURLs
    //   // injectedJavaScript=""
    //   // originWhitelist={['*']}
    //   // source={{ html: '<h1><center>Hello world</center></h1>' }}
    // />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: WIDTH
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
