import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchFollowing } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import FollowItem, { FollowItemProps } from "../feature/follow/followItem";
import { FollowItemResType } from "../feature/follow/types";
import Colors from "../constants/Colors";
//

const FollowScreen = () => {
  const { mid, isMe } = useRoute<any>().params;
  const [list, setList] = useState<FollowItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchFollowing(mid, 50, 1)
      .then((res) => {
        const datalist: FollowItemResType[] = res.data.list;
        const mappedList: FollowItemProps[] = datalist.map((item) => ({
          mid: item.mid,
          attribute: item.attribute,
          face: item.face,
          sign: item.sign,
          uname: item.uname,
          vip: item.vip,
          official_verify: item.official_verify,
        }));
        console.log(mappedList);
        setList(mappedList);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator color={Colors.light.tint} size={'large'}/>
      ) : (
        // <FollowItem
        //   mid={200}
        //   face={"https://avatars.githubusercontent.com/u/22321620?s=40&v=4"}
        //   uname="sixgramwater"
        //   vip={{ vipType: 0, vipStatus: 0 }}
        //   official_verify={{
        //     type: 0,
        //     desc: "个人简介",
        //   }}
        //   sign={"个人签名"}
        //   attribute={0}
        // />
        // <Text>fetched</Text>
        // list.map((item) => <FollowItem {...item} />)
        <FlatList
          // refreshControl={}
          data={list}
          // keyExtractor={(item) => item.mid.toString()}
          renderItem={({ item }) => <FollowItem {...item} />}
          // data
        />
      )}
    </View>
  );
};

export default FollowScreen;

const styles = StyleSheet.create({});
