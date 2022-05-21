import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";

export interface SearchbarProps {
  initialValue?: string;
  onSearch?: () => void;
  onTextChange?: (text: string) => void;
  onSubmit?: () => void;
  value: string;
}

const Searchbar = React.forwardRef<TextInput, SearchbarProps>((props, ref) => {
  const { initialValue, value, onSearch, onSubmit, onTextChange } = props;
  // const inputRef = useRef<TextInput>(null);
  // const [input, setInput] = useState("");
  const handleInput = (text: string) => {
    onTextChange && onTextChange(text);
    // setInput(text);
  };
  const handleClear = () => {
    handleInput("");
  };
  return (
    <View style={styles.searchbarContainer}>
      <View style={styles.iconContainer}>
        <AntDesign
          name="search1"
          size={14}
          style={[{ padding: 0, margin: 0 }, tw`text-gray-500`]}
        />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => handleInput(text)}
        autoFocus
        blurOnSubmit
        onSubmitEditing={() => {
          onSubmit && onSubmit();
        }}
        ref={ref}
      />
      <View style={styles.iconContainerEnd}>
        <Pressable onPress={handleClear}>
          <AntDesign
            name="closecircle"
            size={14}
            style={[{ padding: 0, margin: 0 }, tw`text-gray-500`]}
          />
        </Pressable>

        {/* <AntDesign name="search1" size={14} style={{padding: 0, margin: 0}}/> */}
      </View>
    </View>
  );
});

export default Searchbar;

const styles = StyleSheet.create({
  searchbarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    left: 10,
    top: 6,
    // padd
  },
  iconContainerEnd: {
    position: "absolute",
    right: 10,
    top: 6,
  },
  input: {
    marginLeft: 36,
    marginRight: 36,
  },
});
