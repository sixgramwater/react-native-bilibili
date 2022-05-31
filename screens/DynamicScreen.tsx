import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchDynamic } from "../api";
import Colors from "../constants/Colors";
import DynamicItem, {
  AVDynamicItem,
  DrawDynamicItem,
  DYNAMIC_TYPE,
  LiveDynamicItem,
  WordDynamicItem,
} from "../feature/dynamic/dynamicItem";
import str from '../feature/dynamic/output.json'
// import fs from 'fs';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = (WIDTH / 16) * 9;
const DynamicScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const fetchData = () => {
    setRefreshing(true);
    return fetchDynamic().then(mappedList => {
      setList(mappedList);
      setRefreshing(false);
    })
  }
  useEffect(() => {
    setLoading(true);
    fetchDynamic().then(mappedList => {
      setList(mappedList);
      setLoading(false);
      // setRefreshing(false);
    })
    // console.log(str);
    // fs.readFile('../feature/dynamic/output.json', (err, data) => {
    //   console.log(data.toString());
    //   setLoading(false);
    // })
    // fetchDynamic()
    //   .then((mappedList) => {
    //     const filterdList = mappedList.filter(
    //       (item: any) => item !== null && item !== undefined
    //     );
    //     setList(filterdList);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err);
    //   });
  }, []);
  return (
    // <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color={Colors.light.tint} size={'large'} style={{marginTop: 48}}/>
      ) : (
        <FlatList
          data={list}
          style={{flex: 1}}
          refreshing={loading}
          onRefresh={fetchData}
          // keyExtractor={(item) => item.}
          renderItem={({ item }) => {
            if (!item) return null;
            const type = item.type;
            if (type === DYNAMIC_TYPE.AV) {
              return <AVDynamicItem {...item} />;
            } else if (type === DYNAMIC_TYPE.WORD) {
              return <WordDynamicItem {...item} />;
            } else if (type === DYNAMIC_TYPE.DRAW) {
              return <DrawDynamicItem {...item} />;
            } else if (type === DYNAMIC_TYPE.LIVE_RCMD) {
              return <LiveDynamicItem {...item} />;
            } else {
              return null;
              // return <DynamicItem {...item} />;
            }
            // return <DynamicItem {...item} />;
          }}
        />
      )}

      {/* <ScrollView style={styles.container}> */}
      {/* <DynamicItem />
        <DynamicItem />
        <DynamicItem /> */}

      {/* </ScrollView> */}
    </View>

    // </SafeAreaView>
  );
};
export default DynamicScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: "80%",
  // },
});
