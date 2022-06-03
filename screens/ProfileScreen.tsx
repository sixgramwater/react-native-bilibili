import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
import { AntDesign, Feather } from "@expo/vector-icons";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { fetchUserNav } from "../api";

const FunctionItem = ({
  name,
  icon,
  color,
}: {
  name: string;
  icon: React.ComponentProps<typeof AntDesign>["name"] | React.ReactElement;
  color: string;
}) => {
  return (
    <Pressable style={styles.functionItemContainer}>
      <View>
        {typeof icon === "string" ? (
          <AntDesign name={icon} color={color} size={24} />
        ) : (
          icon
        )}
      </View>
      <Text style={[tw`text-gray-600`, { fontSize: 12, marginTop: 8 }]}>
        {name}
      </Text>
    </Pressable>
  );
};

const ListItem = ({
  name,
  icon,
  color,
}: {
  name: string;
  icon: React.ComponentProps<typeof AntDesign>["name"] | React.ReactElement;
  color: string;
}) => {
  return (
    <Pressable style={styles.listItemContainer}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
          marginRight: 8,
        }}
      >
        {typeof icon === "string" ? (
          <AntDesign name={icon} color={color} size={24} />
        ) : (
          icon
        )}
      </View>
      <Text style={[tw`text-gray-600`, { fontSize: 12 }]}>{name}</Text>
      <View style={{ marginLeft: "auto", alignItems: "center" }}>
        <AntDesign name="right" style={tw`text-gray-400`} size={16} />
      </View>
    </Pressable>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const handlePressFollow = () => {
    const mid = 32383748;
    navigation.navigate("Follow", { mid, isMe: true });
    // fetchUserNav().then((res) => {
    //   console.log(res);
    // });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.light.tint} />
      <View style={styles.profileHeader}>
        <View style={styles.controlHeader}>
          <Pressable style={styles.controlIcon}>
            <Feather
              name="github"
              color="#fff"
              size={22}
              onPress={() => navigation.navigate("Live", { roomid: 22778596 })}
            />
          </Pressable>
          <Pressable style={styles.controlIcon}>
            <AntDesign name="skin" color="#fff" size={22} />
          </Pressable>
          <Pressable style={styles.controlIcon}>
            <Feather name="moon" color="#fff" size={24} />
          </Pressable>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{
                uri: "https://avatars.githubusercontent.com/u/22321620?v=4",
              }}
            />
          </View>
          <View style={{ marginLeft: 15, justifyContent: "space-around" }}>
            <View>
              <Text style={{ color: "#fff", fontSize: 15 }}>SixGramWater</Text>
            </View>
            {/* <View
              style={{ borderColor: "#fff", borderRadius: 4, borderWidth: 1, padding: 1, minWidth: 0 }}
            > */}
            <Text style={{ color: "#ffffff9d", fontSize: 10 }}>硬核会员</Text>
            {/* </View> */}
            <View style={{ flexDirection: "row" }}>
              <Text style={[{ color: "#ffffff9d", fontSize: 11 }]}>
                B币: 0.0
              </Text>
              <Text
                style={{ color: "#ffffff9d", fontSize: 11, marginLeft: 10 }}
              >
                硬币: 1056
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Pressable style={styles.infoItem}>
            <Text style={{ color: "#fff", fontSize: 14 }}>10</Text>
            <Text style={{ color: "#ffffff9d", fontSize: 13 }}>动态</Text>
          </Pressable>
          <View style={styles.seperator}></View>
          <Pressable style={styles.infoItem} onPress={handlePressFollow}>
            <Text style={{ color: "#fff", fontSize: 14 }}>10</Text>
            <Text style={{ color: "#ffffff9d", fontSize: 13 }}>关注</Text>
          </Pressable>
          <View style={styles.seperator}></View>
          <Pressable style={styles.infoItem}>
            <Text style={{ color: "#fff", fontSize: 14 }}>10</Text>
            <Text style={{ color: "#ffffff9d", fontSize: 13 }}>粉丝</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.profileContent}>
        <View style={styles.functionRow}>
          <FunctionItem
            name="离线缓存"
            icon="download"
            color={Colors.light.blue}
          />
          <FunctionItem
            name="历史记录"
            icon="clockcircleo"
            color={Colors.light.blue}
          />
          <FunctionItem
            name="我的收藏"
            icon="staro"
            color={Colors.light.blue}
          />
          <FunctionItem
            name="稍后再看"
            icon="login"
            color={Colors.light.blue}
          />
        </View>
        <Text
          style={{
            fontWeight: "600",
            fontSize: 13,
            marginVertical: 6,
            marginLeft: 16,
          }}
        >
          创作中心
        </Text>
        <View style={styles.functionRow}>
          <FunctionItem name="离线缓存" icon="download" color={"#FBBF24"} />
          <FunctionItem name="历史记录" icon="clockcircleo" color={"#FBBF24"} />
          <FunctionItem name="我的收藏" icon="staro" color={"#FBBF24"} />
          <FunctionItem name="稍后再看" icon="login" color={"#FBBF24"} />
        </View>
        <View style={styles.functionRow}>
          <FunctionItem
            name="离线缓存"
            icon="download"
            color={Colors.light.tint}
          />
          <FunctionItem
            name="历史记录"
            icon="clockcircleo"
            color={Colors.light.tint}
          />
          <FunctionItem
            name="我的收藏"
            icon="staro"
            color={Colors.light.tint}
          />
          <FunctionItem
            name="稍后再看"
            icon="login"
            color={Colors.light.tint}
          />
        </View>
        <Text
          style={{
            fontWeight: "600",
            fontSize: 13,
            marginVertical: 8,
            marginLeft: 16,
          }}
        >
          更多服务
        </Text>
        <View style={styles.listContainer}>
          <ListItem
            name="联系客服"
            icon="customerservice"
            color={Colors.light.tint}
          />
          <ListItem name="商城" icon="shoppingcart" color={Colors.light.tint} />
          <ListItem name="青少年模式" icon="smileo" color={Colors.light.tint} />
          <ListItem name="设置" icon="setting" color={Colors.light.tint} />
          {/* <ListItem name="联系客服" icon='customerservice' color={Colors.light.tint}/> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    height: 64,
    width: 64,
    borderRadius: 64,
    overflow: "hidden",
    borderColor: "#fff",
    // borderWidth: 2,
  },
  avatar: {
    height: 64,
    width: 64,
  },
  controlHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 6,
  },
  controlIcon: {
    marginLeft: 20,
  },
  profileContainer: {
    paddingVertical: 20,
    flexDirection: "row",
  },
  infoContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  infoItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  seperator: {
    width: 1,
    height: 18,
    backgroundColor: "#ffffff32",
  },
  profileContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  functionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  functionItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  listContainer: {},
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    // borderBottomColor: '#f4f5f4',
    // borderBottomWidth: 1,
  },
});
