import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import Searchbar from "./searchbar";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
import Searchbar from "../feature/search/searchbar";
import { useNavigation } from "@react-navigation/native";
import SearchSuggest from "../feature/search/searchSuggest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORE_KEYS, store_push, store_set } from "../utils/store";
import SearchList from "../feature/search/searchList";
import { TextInput } from "react-native-gesture-handler";
// import Colors from "../../constants/Colors";


const SearchScreen = () => {
  const inputRef = useRef<TextInput>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeywords, setSearchKeywords] = useState<string | undefined>(
    undefined
  );
  // const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const navigation = useNavigation();
  const handleSearchChange = useCallback((text: string) => {
    setSearchInput(text);
  }, []);
  const handlePressCancel = () => {
    navigation.goBack();
  };
  const handleSaveSearch = (keywords: string) => {
    store_push(STORE_KEYS.SEARCH_HISTORY, keywords);
  };
  const handleSearch = () => {
    setSearchKeywords(searchInput);
    console.log(searchInput);
    handleSaveSearch(searchInput);
  };
  const handlePressSuggest = (keyword: string) => {
    setSearchInput(keyword);
    setSearchKeywords(keyword);
    inputRef.current?.blur();
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.light.tint} />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Searchbar
              value={searchInput}
              onTextChange={handleSearchChange}
              onSubmit={handleSearch}
              ref={inputRef}
            />
          </View>
          <Pressable onPress={handlePressCancel} style={{ marginLeft: 16 }}>
            <Text style={{ color: "#fff" }}>取消</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          {searchKeywords ? (
            <SearchList keyword={searchKeywords} />
          ) : (
            <SearchSuggest onPress={handlePressSuggest}/>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.tint,
    elevation: 10,
  },
});
