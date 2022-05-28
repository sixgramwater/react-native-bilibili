import {
  Animated,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import React, { useState } from "react";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface DanmuSwitchProps {
  open?: boolean;
  onToggle?: (open?: boolean) => void;
}

const DanmuSwitch: React.FC<DanmuSwitchProps> = (props) => {
  const { open = true, onToggle } = props;
  // const [toggle, setToggle] = useState(true);
  // const;
  const danmuOpenImage = require("../../assets/images/danmu_open.png");
  const danmuCloseImage = require("../../assets/images/danmu_close.png");
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle && onToggle(!open);
    // setToggle(!toggle);
  };
  return (
    <Pressable
      onPress={handleToggle}
      style={{ justifyContent: "center", height: "100%", marginRight: 6 }}
    >
      {/* {" "} */}
      <Animated.View style={styles.switchContainer}>
        {open && (
          <View style={{ paddingLeft: 10, marginRight: 10 }}>
            <Text style={{ color: "#c0c0c0", fontSize: 13 }}>点我发弹幕</Text>
          </View>
        )}

        <View
          style={[
            styles.rightButton,
            { backgroundColor: open ? "#fff" : "#f1f2f4" },
          ]}
        >
          <Image
            source={open ? danmuOpenImage : danmuCloseImage}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default DanmuSwitch;

const styles = StyleSheet.create({
  switchContainer: {
    // marginVertical: 6,
    // marginRight: 12,
    borderRadius: 36,
    backgroundColor: "#f1f2f4",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: "#e5e5e7",
    borderWidth: 1,
    overflow: "hidden",
    // paddingLeft: 10,
  },
  rightButton: {
    paddingVertical: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
});
