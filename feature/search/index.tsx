import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Searchbar from "./searchbar";
import { StatusBar } from "expo-status-bar";
import Colors from "../../constants/Colors";

const Header = () => {
  return <View></View>;
};

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const handleSearchChange = useCallback((text: string) => {
    setSearchInput(text);
  }, []);
  const handlePressCancel = () => {};
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={Colors.light.tint} />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Searchbar value={searchInput} onTextChange={handleSearchChange} />
          </View>
          <Pressable onPress={handlePressCancel}>
            <Text>取消</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </SafeAreaView>
  );
};

export default SearchPage;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
