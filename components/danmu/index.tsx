import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { fetchDanmuXml } from "../../api";
import { parseDanmuToJSON } from "../../utils";
// import {  }

export interface DanmuProps {
  cid?: number;
  isPlaying?: boolean;
  seekTime?: number;
}

export type DanmuType = {
  startTime: number;
  type: number;
  size: number;
  color: string;
  sendTime: number;
  poolType: number;
  userHash: string;
  dmid: number;
  content: string;
};

const WIDTH = Dimensions.get("screen").width;

const Danmu: React.FC<DanmuProps> = React.memo((props) => {
  const { cid, isPlaying } = props;
  const offset = useRef(new Animated.Value(WIDTH)).current;
  const animatationRef = useRef<Animated.CompositeAnimation>();
  const ref = useRef<View>(null);
  const containerRef = useRef<View>(null);
  const initialDateRef = useRef<number>();
  const [duration, setDuration] = useState(5000);
  // const [list, setList] = useState<DanmuType[]>([]);
  // const [status, setStatus] = useState();

  // useEffect(() => {
  //   fetchDanmuXml(cid).then((xml) => {
  //     const danmuList = parseDanmuToJSON(xml);
  //     setList(danmuList);
  //   });
  // }, [cid]);
  useEffect(() => {
    // Animated.timing(offset, {
    //   toValue: -150,
    //   duration: 9000,
    //   useNativeDriver: true,
    //   easing: Easing.linear,
    // }).start();
    // if (!animatationRef.current) {
    //   animatationRef.current = Animated.timing(offset, {
    //     toValue: -150,
    //     duration: 9000,
    //     useNativeDriver: false,
    //     easing: Easing.linear,
    //   });
    // }
    if (isPlaying) {
      initialDateRef.current = Number(new Date());
      Animated.timing(offset, {
        toValue: -150,
        duration: duration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
      // setDate()
    } else {
      if(!initialDateRef.current) return;
      Animated.timing(offset, {
        toValue: -150,
        duration: duration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).stop();
      
      const passed = Number(new Date()) - initialDateRef.current;
      setDuration(dur=>dur-passed);
      // ref.current?.measureLayout(
      //   containerRef as any,
      //   (x, y, width, height) => {
      //     setLayoutX(x);
      //     console.log(x);
      //   },
      //   () => {
      //     console.log("error");
      //   }
      // );
    }
    // if(isPlaying) {
    //   requestAnimationFrame(() => {
    //     Animated.timing(offset, {
    //       toValue: offset,
    //       duration: 9000,
    //       useNativeDriver: false,
    //       easing: Easing.linear,
    //     });
    //   })
    // }
  }, [isPlaying]);

  return (
    <View style={styles.danmuContainer} ref={containerRef}>
      <Animated.View
        style={
          (styles.danmuItem,
          {
            transform: [
              {
                translateX: offset,
              },
            ],
          })
        }
      >
        <View ref={ref}>
          <Text style={{ fontSize: 13, color: "#fff", flexGrow: 0 }}>
            测试弹幕
          </Text>
        </View>
      </Animated.View>
    </View>
  );
});

export default Danmu;

const styles = StyleSheet.create({
  danmuContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  danmuItem: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 20,
    justifyContent: "center",
  },
});
