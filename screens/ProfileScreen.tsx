import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
import { AntDesign, Feather } from "@expo/vector-icons";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.light.tint} />
      {/* <View style={styles.profileHeader}>
        <View style={styles.controlHeader}>
          <Pressable style={styles.controlIcon}>
            <Feather name="github" color="#fff" size={16} />
          </Pressable>
          <Pressable style={styles.controlIcon}>
            <AntDesign name="skin" color="#fff" size={16} />
          </Pressable>
          <Pressable style={styles.controlIcon}>
            <Feather name="moon" color="#fff" size={16} />
          </Pressable>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: 'https://avatars.githubusercontent.com/u/22321620?v=4'}}/>
          </View>
        </View>
        <View style={styles.infoContainer}></View>
      </View> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
