import {
  Animated,
  Button,
  Dimensions,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { fetchDanmuXml } from "../../api";
import { getRandomString, parseDanmuToJSON } from "../../utils";
import Colors from "../../constants/Colors";
import { useInterval } from "../../hooks/useInterval";
// import util from "util";
// import MeasureText from 'react-native-measure-text';
// import rnTextSize, { TSFontSpecs, TSMeasureResult } from "react-native-text-size";

// import Animated2, {
//   cancelAnimation,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
//   Easing as Easing2
// } from "react-native-reanimated";
// import {  }

export interface DanmuProps {
  shouldPlay?: boolean;
  // seekTime?: number;
  data: DanmuType[];
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

export type DanmuItemType = {
  size?: number;
  color?: string;
  content: string;
  isPlaying: boolean;
  track: number;
  id: number;
  onFinish: (id: number) => void;
  onLayout: (id: number, width: number, ref: React.ForwardedRef<Text>) => void;
  // onLayout: ({width: number, height: number}) => void;
};

const WIDTH = Dimensions.get("screen").width;

const TRACK_HEIGHT = 20;

const DURATION = 8000;

// const ReDanmuItem: React.FC<DanmuItemType> = React.memo((props) => {
//   const {
//     size = 16,
//     color = "#fff",
//     content,
//     id,
//     isPlaying,
//     track,
//     onFinish,
//   } = props;
//   const offset = useSharedValue(WIDTH);
//   const [duration, setDuration] = useState(8000);
//   const initialDateRef = useRef<number>();
//   const [width, setWidth] = useState<number | undefined>();
//   // const textRef = useRef<Animated2.Text>(null);
//   const animatedStyles = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: offset.value }],
//     };
//   });
//   // useEffect(() => {
//   //   // textRef.current?.measureInWindow((x, y, width, height) => {
//   //   //   setWidth(width);
//   //   // });
//   // }, []);
//   useEffect(() => {
//     "worklet";
//     // if (!width) return;
//     if (isPlaying) {
//       initialDateRef.current = Number(new Date());
//       // console.log(width);
//       offset.value = withTiming(
//         -150,
//         {
//           duration,
//           easing: Easing2.linear,
//         },
//         // (finished) => {
//         //   console.log("finish");
//         //   if (finished) onFinish && onFinish(id);
//         // }
//       );
//       // Animated.timing(offset, {
//       //   toValue: -width,
//       //   duration: duration,
//       //   // isInteraction: false,
//       //   useNativeDriver: true,
//       //   easing: Easing.linear,
//       // }).start(({ finished }) => {
//       //   if (finished) {
//       //     onFinish && onFinish(id);
//       //     // console.log("finish:" + id);
//       //   }
//       // });
//       // setDate()
//     } else {
//       if (!initialDateRef.current) return;
//       cancelAnimation(offset);
//       // Animated.timing(offset, {
//       //   toValue: -width,
//       //   duration: duration,
//       //   useNativeDriver: true,
//       //   easing: Easing.linear,
//       // }).stop();

//       const passed = Number(new Date()) - initialDateRef.current;
//       setDuration((dur) => dur - passed);
//     }
//   }, [isPlaying, width]);
//   return (
//     <Animated2.View
//       // ref={textRef}
//       style={[
//         {
//           position: "absolute",
//           // top: 0,
//           left: 0,
//           top: track * TRACK_HEIGHT,
//         },
//         animatedStyles,
//       ]}
//     >
//       <Text
//         style={{
//           fontSize: size,
//           // flexGrow: 0,
//           color: color,
//         }}
//       >
//         {content}
//       </Text>
//     </Animated2.View>
//   );
// });

const DanmuItem = React.memo(
  forwardRef<Text, DanmuItemType>((props, ref) => {
    const {
      size = 16,
      color = "#fff",
      content,
      id,
      isPlaying,
      track,
      onFinish,
      onLayout,
    } = props;
    const offset = useRef(new Animated.Value(WIDTH)).current;
    const [duration, setDuration] = useState(8000);
    const initialDateRef = useRef<number>();
    const containerRef = useRef();
    const textRef = useRef<Text>(null);
    const [width, setWidth] = useState<number | undefined>();
    // const
    useEffect(() => {
      // if (!ref) return;
      textRef.current?.measureInWindow((x, y, width, height) => {
        setWidth(width);
        onLayout && onLayout(id, width, ref);
      });
    }, []);
    // const handleLayout = useCallback((e: LayoutChangeEvent) => {
    //   const { width } = e.nativeEvent.layout;
    //   setWidth(width);
    //   onLayout && onLayout(id, width, ref);
    // }, []);

    useEffect(() => {
      if (!width || track === -1) return;
      if (isPlaying) {
        initialDateRef.current = Number(new Date());
        Animated.timing(offset, {
          toValue: -width,
          duration: duration,
          // isInteraction: false,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start(({ finished }) => {
          if (finished) {
            onFinish && onFinish(id);
            // console.log("finish:" + id);
          }
        });
        // setDate()
      } else {
        if (!initialDateRef.current) return;
        Animated.timing(offset, {
          toValue: -width,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.linear,
        }).stop();

        const passed = Number(new Date()) - initialDateRef.current;
        setDuration((dur) => dur - passed);
      }
    }, [isPlaying, width, track]);

    return (
      <Animated.View
        ref={textRef}
        // onLayout={handleLayout}
        renderToHardwareTextureAndroid={true}
        // ref={ref}
        // ref={containerRef}
        style={[
          styles.danmuItem,
          {
            transform: [
              {
                translateX: offset,
              },
            ],
            top: track * TRACK_HEIGHT,
          },
        ]}
      >
        {/* <View ref={ref}> */}
        <Text
          style={{
            fontSize: size,
            color: color,
            textShadowRadius: 2,
            textShadowColor: `rgba(0,0,0,1)`,
          }}
          ref={ref}
          // ref={textRef}
        >
          {content ?? "测试弹幕"}
        </Text>
        {/* </View> */}
      </Animated.View>
    );
  })
);

const initialDanmuList: any = [
  // {
  //   id: 0,
  //   content: "hello, world",
  //   track: 0,
  //   deleted: false,
  // },
];

export interface DanmakuRef {
  //播放
  play: () => void;
  //暂停
  pause: () => void;
  //停止
  stop: () => void;
  /**
   * @description 跳转至某时间点
   * @param time 时间点，毫秒
   * @param play 可选 跳转后是否播放 默认为false
   */
  seek: (time: number, play?: boolean) => void;
  /**
   * @description 发送弹幕
   * @param data 弹幕数据
   * @param time 可选 弹幕所在时间点，默认为当前时间
   */
  send: (data: DanmuType, time?: number) => void;
}

const Danmu = React.memo(
  forwardRef<DanmakuRef, DanmuProps>((props, ref) => {
    const { shouldPlay, data } = props;
    useImperativeHandle(ref, () => ({
      play,
      pause,
      seek,
      stop,
      send,
    }));
    const play = () => {
      setIsPlaying(true);
    };

    const pause = () => {
      setIsPlaying(false);
    };

    const seek = (time: number) => {
      setDanmuList([]);
      startTime.current = Number(Date.now()) - time;
      if (!isPlaying) {
        stopTime.current = Number(Date.now());
      }
      curIndex.current = data.findIndex((item) => item.startTime >= time);
    };

    const send = (data: Partial<DanmuType>, time?: number) => {
      handleAddDanmu();
    };

    const stop = () => {
      seek(0);
    };
    // const offset = useRef(new Animated.Value(WIDTH)).current;
    // const animatationRef = useRef<Animated.CompositeAnimation>();
    // const ref = useRef<View>(null);
    const containerRef = useRef<View>(null);
    // const initialDateRef = useRef<number>();
    // const [duration, setDuration] = useState(5000);
    const [danmuList, setDanmuList] = useState<Partial<DanmuItemType>[]>([]);
    const danmuRef = useRef<any>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    // const lastTrackRef = useRef<number>();
    const lastIdRef = useRef<number>(0);
    const trackLimit = 5;
    const trackLastPushedList = useRef(new Array(trackLimit));

    const startTime = useRef<number>(Number(Date.now()));
    const passedTime = useRef<number>(0);
    const stopTime = useRef<number | undefined>(undefined);
    const curIndex = useRef<number>(0);

    useEffect(() => {
      if (isPlaying) {
        if (stopTime.current)
          startTime.current += Number(Date.now()) - stopTime.current;
        // startTime.current = Number(Date.now()) - seekTime;
      } else {
        stopTime.current = Number(Date.now());
      }
      // timeRef.current = Number(Date.now());
    }, [isPlaying]);

    useEffect(() => {
      if (shouldPlay) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }, [shouldPlay]);
    // useEffect(() => {
    //   passedTime.current = seekTime;
    //   startTime.current = Number(Date.now()) - seekTime;
    //   if (!isPlaying) {
    //     stopTime.current = Number(Date.now());
    //   }
    // }, [isPlaying, seekTime]);

    const loop = () => {
      passedTime.current = Number(Date.now()) - startTime.current;
      // console.log(passedTime.current);
      // const prepareToSendList = [];
      // console.log(i)
      let count = 0;
      for (let i = curIndex.current; i < data.length; i++) {
        const danmuItem = data[i];
        if (passedTime.current > danmuItem.startTime) {
          handleAddDanmu2(danmuItem);
          count++;
        } else {
          curIndex.current = i;
          break;
        }
      }
      console.log(`send ${count} this round: ${passedTime.current}`);
      // prepareToSendList.length > 0 &&
      //   prepareToSendList.forEach((item) => {
      //     handleAddDanmu2(item);
      //   });
    };
    useInterval(
      () => {
        loop();
      },
      isPlaying && shouldPlay ? 500 : null
    );
    // const textLen

    const checkWillCollide = (x: number, width1: number, width2: number) => {
      if (width2 < width1) return false;

      const duration = DURATION;
      const v1 = (width1 + WIDTH) / duration;
      const v2 = (width2 + WIDTH) / duration;
      const t_catch = (WIDTH - x - width1) / (v2 - v1);
      const t_disappear = (x + width1) / v1;
      // console.log(t_catch, t_disappear);
      return t_catch < t_disappear;
      // return (
      //   (firstX + firstWidth) / (firstWidth + WIDTH) > WIDTH / (testWidth + WIDTH)
      // );
    };

    const handleRemove = useCallback((id: number) => {
      const newest = danmuRef.current;
      const filterd = newest.filter((item: any) => item.id !== id);
      danmuRef.current = filterd;
      // console.log(filterd);
      setDanmuList(filterd);
    }, []);

    const pickTrack2 = (textWidth: number) => {
      const trackRefList = trackLastPushedList.current;
      for (let i = 0; i < trackRefList.length; i++) {
        let curRef = trackRefList[i];
        // const promisifyFunc = util.promisify(curRef.current?.measureInWindow);
      }
    };
    const pickTrack = (textWidth: number) => {
      const trackRefList = trackLastPushedList.current;
      // let track = -1;
      let settled = false;

      let promise = new Promise<number>((resolve) => {
        for (let i = 0; i < trackRefList.length; i++) {
          let curRef = trackRefList[i];
          if (curRef && !settled) {
            if (!curRef.current) {
              resolve(i);
              // settled = true;
              // track = i;
              break;
            }
            curRef.current?.measureInWindow(
              (x: number, y: number, width: number) => {
                if (settled) return;
                // console.log()
                // console.log(`track${i} width: ${width}`);
                // console.log(`track${i} x: ${x}`);
                if (y > width || !checkWillCollide(x, width, textWidth)) {
                  // console.log("set to: " + i);
                  resolve(i);
                  // track = i;
                  settled = true;
                  // break;
                }
                // console.log("track" + i + ": " + x);
              }
            );
            if (settled) break;
          } else {
            resolve(i);
            // track = i;
            settled = true;
            break;
          }

          // console.log(curRef.current)
          // if(!curRef.current)
        }
        // if(track === -1) {

        // }
      });

      return promise;
    };
    const handleAddDanmu = async () => {
      if (!lastIdRef.current) {
        lastIdRef.current = 0;
      }
      const id = ++lastIdRef.current;
      const trackRefList = trackLastPushedList.current;
      // let _track = 0;
      // console.log("----");
      // const fontSpecs: TSFontSpecs = {
      //   fontFamily: undefined,
      //   fontSize: 16,
      //   // fontStyle: 'italic',
      //   // fontWeight = 'bold',
      // };
      const randomLen = Math.floor(Math.random() * 14);
      const randomText = getRandomString(randomLen);
      // console.log(randomText);
      // let size = await rnTextSize.measure({
      //   text: '123412adfdsaf',
      // })
      //什么时候直到ffaacad
      // const textElem = React.createElement(Text, null, randomText);

      // const textWidth = randomLen * 12;
      // console.log("textWidth", textWidth);
      // const track = await pickTrack(textWidth);
      // let track = -1;
      // let settled = false;
      // for (let i = 0; i < trackRefList.length && !settled; i++) {
      //   let curRef = trackRefList[i];
      //   if (curRef && !settled) {
      //     if (!curRef.current) {
      //       settled = true;
      //       track = i;
      //       break;
      //     }
      //     curRef.current?.measureInWindow(
      //       (x: number, y: number, width: number) => {
      //         // console.log()
      //         console.log(`track${i} width: ${width}`);
      //         console.log(`track${i} x: ${x}`);
      //         if (!checkWillCollide(x, width, textWidth)) {
      //           console.log("set to: " + i);
      //           track = i;
      //           settled = true;
      //           // break;
      //         }
      //         // console.log("track" + i + ": " + x);
      //       }
      //     );
      //     if (settled) break;
      //   } else {
      //     track = i;
      //     settled = true;
      //     break;
      //   }
      //   // console.log(curRef.current)
      //   // if(!curRef.current)
      // }
      // console.log("track", track);
      // if (track === -1) return;
      // trackRefList.forEach((ref, index) => {
      //   if(ref.current) {
      //     ref.current.measureInWindow((x, y, width) => {
      //       console.log('track'+index+": "+x);
      //       if(x > WIDTH/2) {
      //         _track = index;

      //       }
      //     })
      //   }
      // })

      // const track = chooseTrack();

      const newRef = React.createRef<Text>();
      const pushedDanmuList = [
        ...danmuList,
        {
          id,
          content: randomText,
          track: -1,
          ref: newRef,
          color: Colors.light.blue,
          // deleted: false,
        },
      ];
      // trackRefList[track] = newRef;
      // console.log(pushedDanmuList);
      setDanmuList(pushedDanmuList);
      danmuRef.current = pushedDanmuList;
    };
    const handleSetWidth = async (
      id: number,
      width: number,
      ref: ForwardedRef<Text>
    ) => {
      const trackRefList = trackLastPushedList.current;
      const track = await pickTrack(width);
      // console.log(track);
      const danmuList = danmuRef.current;
      let mappedList = danmuList.map((item: any) =>
        item.id === id ? { ...item, track } : item
      );
      setDanmuList(mappedList);
      danmuRef.current = mappedList;
      trackRefList[track] = ref;
    };

    const handleAddDanmu2 = (danmuItem: DanmuType) => {
      const {
        startTime,
        type,
        size,
        color,
        sendTime,
        poolType,
        userHash,
        dmid,
        content,
      } = danmuItem;
      // if(type !== 0)  return;
      // console.log("prepare to send", dmid);
      const newRef = React.createRef<Text>();
      const id = ++lastIdRef.current;
      const pushedDanmuList = [
        ...danmuList,
        {
          id,
          content,
          track: -1,
          ref: newRef,
          color,
          // deleted: false,
        },
      ];
      setDanmuList(pushedDanmuList);
      danmuRef.current = pushedDanmuList;
    };
    // const [list, setList] = useState<DanmuType[]>([]);
    // const [status, setStatus] = useState();

    // useEffect(() => {
    //   fetchDanmuXml(cid).then((xml) => {
    //     const danmuList = parseDanmuToJSON(xml);
    //     setList(danmuList);
    //   });
    // }, [cid]);

    return (
      <View>
        <View style={styles.danmuContainer} ref={containerRef}>
          {danmuList.map((item: any) => {
            // const track = item.track;
            // let ref = React.createRef<Text>();

            return (
              <DanmuItem
                key={item.id}
                id={item.id!}
                content={item.content!}
                track={item.track!}
                onFinish={handleRemove}
                onLayout={handleSetWidth}
                isPlaying={isPlaying}
                size={item.size}
                color={item.color}
                ref={item.ref!}
              />
            );
          })}
          {/* <Text></Text> */}
        </View>
        {/* <View style={{ position: "absolute", bottom: -100, left: 0, right: 0 }}>
          <Button onPress={handleAddDanmu} title="click" />
        </View> */}
      </View>
    );
  })
);

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
