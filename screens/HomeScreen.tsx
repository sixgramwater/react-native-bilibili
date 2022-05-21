import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SectionList,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BottomSheet, Button, ListItem } from "@rneui/themed";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";
import { Avatar, Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ScrollableTabs from "../components/scrollableTabView";
import { useNavigation } from "@react-navigation/native";

const DATA = [
  {
    id: 1,
  },
];

const HomeHeader = () => {
  const userAvatar =
    "https://static.cloudwhite.xyz:444/47a99d35216b-4e24-b63a-4f69c418cb0d.png";

  return (
    <View style={[styles.header]}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: userAvatar }} />
      </View>
      <HomeSearch />
      <View style={styles.iconButton}>
        <TouchableOpacity
          onPress={() => {
            console.log("click icon");
          }}
        >
          <AntDesign name="mail" color={"#fff"} size={20} />
        </TouchableOpacity>
      </View>
      {/* <Avatar source={{uri: userAvatar}}/> */}
    </View>
  );
};

const HomeSearch = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Search");
        // console.log("press Search");
      }}
      style={styles.searchContainer}
      // style={{ alignItems: "center" }}
    >
      {/* <View style={styles.searchContainer}> */}
      <AntDesign
        name="search1"
        color={"rgba(255, 255, 255, 0.435)"}
        size={16}
        style={{ marginLeft: 8 }}
      />
      <Text style={styles.searchText}>搜索内容</Text>
      {/* </View> */}
    </Pressable>
  );
};

const HomeScreen = () => {
  // const [isVisible, setIsVisible] = useState(false);
  // const list = [
  //   { title: "List Item 1" },
  //   { title: "List Item 2" },
  //   {
  //     title: "Cancel",
  //     containerStyle: { backgroundColor: "red" },
  //     titleStyle: { color: "white" },
  //     onPress: () => setIsVisible(false),
  //   },
  // ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={Colors.light.tint} />
        {/* <SectionList
          style={{flex: 1}}
          
        // StickyHeaderComponent={<HomeHeader />}
        > */}
        <HomeHeader />

        <ScrollableTabs />
        {/* </SectionList> */}
        {/* <HomeHeader />
        
        
        <ScrollableTabs /> */}
        {/* <SectionList
          stickySectionHeadersEnabled={true}
          ListHeaderComponent={}
        /> */}
        {/* <Text>HomeScreen</Text> */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  header: {
    backgroundColor: "#fb7299",
    height: 48,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  avatarContainer: {
    height: 36,
    width: 36,
    borderRadius: 36,
    overflow: "hidden",
  },
  avatar: {
    height: 36,
    width: 36,
    // overflow: "hidden",
  },
  searchContainer: {
    backgroundColor: "rgba(0,0,0,0.09)",
    width: 220,
    marginLeft: 24,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
  },
  searchText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.435)",
    marginLeft: 4,
  },
  iconButton: {
    display: "flex",
    flexDirection: "row",

    marginLeft: "auto",
  },
});
