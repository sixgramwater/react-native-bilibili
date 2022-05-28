import {
  ActivityIndicator,
  Button,
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { AntDesign, createMu, Feather, FontAwesome5 } from "@expo/vector-icons";
import navigation from "../../navigation";
import { useNavigation } from "@react-navigation/core";
import Slider from "@react-native-community/slider";
import Colors from "../../constants/Colors";
import {
  backgroundLinearImage,
  getMinutesSecondsFromMilliseconds,
  parseDanmuToJSON,
} from "../../utils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
import * as Brightness from "expo-brightness";
import Danmu, { DanmakuRef, DanmuType } from "../danmu";
import { fetchDanmuXml } from "../../api";

export enum ControlStates {
  Visible = "Visible",
  Hidden = "Hidden",
}

export enum PlaybackStates {
  Loading = "Loading",
  Playing = "Playing",
  Paused = "Paused",
  Buffering = "Buffering",
  Error = "Error",
  Ended = "Ended",
}

export enum ErrorSeverity {
  Fatal = "Fatal",
  NonFatal = "NonFatal",
}

export enum ShowControlModal {
  Volume = "Volume",
  Progress = "Progress",
  Light = "Light",
  Hidden = "Hidden",
}

export type ErrorType = {
  type: ErrorSeverity;
  message: string;
  obj: Record<string, unknown>;
};

export interface VideoPlayerProps {
  src?: string;
  defaultControlsVisible?: boolean;
  cid?: number;
  showDanmu?: boolean;
}
const VideoPlayer: React.FC<VideoPlayerProps> = React.memo((props) => {
  const { src, cid } = props;
  let initialShow = props.defaultControlsVisible;
  let playbackInstance: Video | null = null;
  let controlsTimer: NodeJS.Timeout | null = null;
  let fetchTimer: NodeJS.Timeout | null = null;
  const video = React.useRef<Video>(null);
  const [status, setStatus] = React.useState<any>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [controlsState, setControlsState] = useState(
    props.defaultControlsVisible ? ControlStates.Visible : ControlStates.Hidden
  );
  const [panProgress, setPanProgress] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [brightness, setBrightness] = useState(0.5);
  const [brightnessPermitted, setBrightnessPermitted] = useState(false);
  const [showControlModal, setShowControlModal] = useState<ShowControlModal>(
    ShowControlModal.Hidden
  );
  const [isPanning, setIsPanning] = useState(false);
  const [danmuData, setDanmuData] = useState<DanmuType[]>([]);
  const danmukuRef = useRef<DanmakuRef>(null);

  useEffect(() => {
    if (!cid || cid === -1) return;
    fetchDanmuXml(cid).then((value) => {
      const danmuList = parseDanmuToJSON(value);
      console.log(`fetched ${danmuList.length} danmu`);
      const sortedList = danmuList
        .slice(0, danmuList.length > 500 ? 500 : -1)
        .sort((a, b) => a.startTime - b.startTime)
        .map((item) => {
          return {
            ...item,
            startTime: item.startTime * 1000,
          };
        });
      setDanmuData(sortedList);
    });
  }, [cid]);

  // const handleClickButton = () => {};
  const navigation = useNavigation<any>();
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: src ? PlaybackStates.Loading : PlaybackStates.Error,
  });

  const fetchStatusAndUpdate = () => {
    video.current?.getStatusAsync().then((status) => {
      updatePlaybackCallback(status);
      if (!isPanning && status.isLoaded) {
        // console.log('update panprogress')
        setPanProgress(status.positionMillis);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === "granted") {
        setBrightnessPermitted(true);
        // Brightness.setSystemBrightnessAsync(1);
      }
    })();
  }, []);

  useEffect(() => {
    if (!danmukuRef.current) return;
    if (playbackInstanceInfo.state === PlaybackStates.Playing) {
      danmukuRef.current.play();
    } else if(playbackInstanceInfo.state === PlaybackStates.Paused) {
      danmukuRef.current.pause();
    }
  }, [playbackInstanceInfo.state, danmukuRef.current]);

  useEffect(() => {
    if (playbackInstanceInfo.state === PlaybackStates.Playing) {
      fetchTimer = setInterval(fetchStatusAndUpdate, 1000);
    }
    return () => {
      fetchTimer && clearInterval(fetchTimer);
    };
  }, [video.current, playbackInstanceInfo.state, isPanning]);

  const animationToggle = (open: boolean = false) => {
    if (controlsState === ControlStates.Hidden || open === true) {
      setControlsState(ControlStates.Visible);
      if (controlsTimer === null) {
        controlsTimer = setTimeout(() => {
          console.log("close");
          setControlsState(ControlStates.Hidden);
        }, 5000);
      } else {
        clearTimeout(controlsTimer);
        controlsTimer = setTimeout(() => {
          console.log("close");
          setControlsState(ControlStates.Hidden);
        }, 5000);
      }
    } else if (controlsState === ControlStates.Visible) {
      // hideAnimation()
      setControlsState(ControlStates.Hidden);
      if (controlsTimer) {
        clearTimeout(controlsTimer);
      }
    }
    // if (controlsTimer === null) {
    //   controlsTimer = setTimeout(() => {
    //     if (
    //       playbackInstanceInfo.state === PlaybackStates.Playing &&
    //       controlsState === ControlStates.Hidden
    //     ) {
    //       setControlsState(ControlStates.Hidden);
    //       // hideAnimation()
    //     }
    //     if (controlsTimer) {
    //       clearTimeout(controlsTimer);
    //     }
    //     controlsTimer = null;
    //   }, 2000);
    // }
  };

  const tabGesture = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      animationToggle();
      console.log("tap");
      // console.log()
    });

  const doubleTabGesture = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      togglePlay();
      console.log("double tab");
    });
  doubleTabGesture.config = { numberOfTaps: 2 };

  const verticalGestureRight = Gesture.Pan()
    .onStart(() => {
      setShowControlModal(ShowControlModal.Volume);
    })
    .onUpdate((e) => {
      const ratio = -e.translationY / (HEIGHT - 72) + volume;
      const targetRatio = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
      setVolume(targetRatio);
    })
    .onEnd(() => {
      setShowControlModal(ShowControlModal.Hidden);
    });

  const verticalGestureLeft = Gesture.Pan()
    .onStart(() => {
      setShowControlModal(ShowControlModal.Light);
    })
    .onUpdate((e) => {
      const ratio = -e.translationY / (HEIGHT - 72) + brightness;
      const targetRatio = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
      setBrightness(targetRatio);
      Brightness.setBrightnessAsync(targetRatio);
    })
    .onEnd(() => {
      setShowControlModal(ShowControlModal.Hidden);
    });

  const horizontalGesture = Gesture.Pan()
    .onStart(() => {
      setShowControlModal(ShowControlModal.Progress);
      // setPanProgress(playbackInstanceInfo.position);
      setIsPanning(true);
    })
    .onUpdate((e) => {
      const ratio = e.translationX / WIDTH;
      // console.log('ratio', ratio);
      const offsetProgress =
        ratio * playbackInstanceInfo.duration + playbackInstanceInfo.position;
      // console.log('offset', offsetProgress);
      // const targetProgress = offsetProgress;
      const targetProgress =
        offsetProgress < 0
          ? 0
          : offsetProgress > playbackInstanceInfo.duration
          ? playbackInstanceInfo.duration
          : offsetProgress;

      setPanProgress(targetProgress);
    })
    .onEnd(async () => {
      if (video.current) {
        await video.current.setStatusAsync({
          positionMillis: panProgress,
          shouldPlay: true,
        });
      }
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: panProgress,
      });
      setIsPanning(false);
      setShowControlModal(ShowControlModal.Hidden);
    });

  const togglePlay = async () => {
    const shouldPlay = playbackInstanceInfo.state !== PlaybackStates.Playing;
    if (video.current !== null) {
      await video.current.setStatusAsync({
        shouldPlay,
        ...(playbackInstanceInfo.state === PlaybackStates.Ended && {
          positionMillis: 0,
        }),
      });
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state:
          playbackInstanceInfo.state === PlaybackStates.Playing
            ? PlaybackStates.Paused
            : PlaybackStates.Playing,
      });
      // if (shouldPlay) {
      //   animationToggle(true);
      // }
      animationToggle(true);
    }
  };
  const updatePlaybackCallback = (status: AVPlaybackStatus) => {
    // console.log(status?.position);
    if (status.isLoaded) {
      // console.log(status.positionMillis);
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state:
          status.positionMillis === status.durationMillis
            ? PlaybackStates.Ended
            : status.isBuffering
            ? PlaybackStates.Buffering
            : status.shouldPlay
            ? PlaybackStates.Playing
            : PlaybackStates.Paused,
      });
      if (
        (status.didJustFinish && controlsState === ControlStates.Hidden) ||
        (status.isBuffering &&
          controlsState === ControlStates.Hidden &&
          initialShow)
      ) {
        animationToggle();
        initialShow = false;
      }
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        setErrorMessage(errorMsg);
        // props.errorCallback({ type: ErrorSeverity.Fatal, message: errorMsg, obj: {} })
      }
    }
  };

  const renderModal = () => {
    if (showControlModal === ShowControlModal.Progress)
      return (
        <View style={styles.modal}>
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
            {getMinutesSecondsFromMilliseconds(
              panProgress
              // playbackInstanceInfo.position
            )}
            /{getMinutesSecondsFromMilliseconds(playbackInstanceInfo.duration)}
          </Text>
        </View>
      );
    if (showControlModal === ShowControlModal.Volume)
      return (
        <View
          style={[
            styles.modal,
            {
              width: "33%",
            },
          ]}
        >
          {/* <View> */}
          <MaterialCommunityIcons
            name={volume === 0 ? "volume-mute" : "volume-high"}
            color="#fff"
            size={18}
            style={{ marginRight: 12 }}
          />
          {/* </View> */}
          <View
            style={{
              position: "relative",
              height: 2,
              backgroundColor: "hsla(0,0%,100%,.2)",
              flex: 1,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                backgroundColor: Colors.light.tint,
                width: volume * 100 + "%",
                height: "100%",
              }}
            ></View>
          </View>
        </View>
      );
    if (showControlModal === ShowControlModal.Light)
      return (
        <View
          style={[
            styles.modal,
            {
              width: "33%",
            },
          ]}
        >
          {/* <View> */}
          <Feather
            name={"sun"}
            color="#fff"
            size={18}
            style={{ marginRight: 12 }}
          />
          {/* </View> */}
          <View
            style={{
              position: "relative",
              height: 2,
              backgroundColor: "hsla(0,0%,100%,.2)",
              flex: 1,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                backgroundColor: Colors.light.tint,
                width: brightness * 100 + "%",
                height: "100%",
              }}
            ></View>
          </View>
        </View>
      );
  };
  return (
    <View style={styles.videoContainer}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: src ? src : "",
          // ? src
          // : "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        }}
        // progressUpdateIntervalMillis={1000}
        // useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        volume={volume}
        // isLooping
        onPlaybackStatusUpdate={(status) => updatePlaybackCallback(status)}
      />
      <View style={styles.videoController}>
        {!(
          playbackInstanceInfo.state === PlaybackStates.Playing &&
          controlsState === ControlStates.Hidden
        ) && (
          <View style={styles.header}>
            <Pressable
              android_ripple={{
                radius: 14,
                foreground: true,
                borderless: true,
                color: "rgba(255,255,255,0.3)",
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <AntDesign
                color={"#fff"}
                name="arrowleft"
                size={24}
                style={styles.backButton}
              />
            </Pressable>
            <View>
              <Pressable
                android_ripple={{
                  radius: 14,
                  foreground: true,
                  borderless: true,
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                <AntDesign
                  color={"#fff"}
                  name="ellipsis1"
                  size={24}
                  style={[
                    {
                      transform: [{ rotate: "90deg" }],
                    },
                  ]}
                />
              </Pressable>
            </View>
            {/* <Text>123</Text> */}
          </View>
        )}

        <GestureDetector
          gesture={Gesture.Exclusive(
            doubleTabGesture,
            tabGesture,
            horizontalGesture
          )}
        >
          <View style={styles.middleContainer}>
            {playbackInstanceInfo.state === PlaybackStates.Buffering ||
            playbackInstanceInfo.state === PlaybackStates.Loading ? (
              <ActivityIndicator color={"#fff"} size="large" />
            ) : (
              renderModal()
              // showControlModal === ShowControlModal.Progress && (
              //   <View style={styles.modal}>
              //     <Text
              //       style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
              //     >
              //       {getMinutesSecondsFromMilliseconds(
              //         panProgress
              //         // playbackInstanceInfo.position
              //       )}
              //       /
              //       {getMinutesSecondsFromMilliseconds(
              //         playbackInstanceInfo.duration
              //       )}
              //     </Text>
              //   </View>
              // )
            )}
            <GestureDetector gesture={verticalGestureLeft}>
              <View
                style={{
                  width: "40%",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
              ></View>
            </GestureDetector>
            <GestureDetector gesture={verticalGestureRight}>
              <View
                style={{
                  width: "40%",
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              ></View>
            </GestureDetector>
          </View>
        </GestureDetector>

        {controlsState === ControlStates.Visible ? (
          <View style={styles.footContainer}>
            {/* <ImageBackground source={{uri: backgroundLinearImage}} resizeMode={'stretch'} style={{
              // width: WIDTH,
              // height: 36,
              flex: 1,
            }}> */}
            <Pressable onPress={togglePlay}>
              <View style={styles.icon}>
                <FontAwesome5
                  name={
                    playbackInstanceInfo.state === PlaybackStates.Playing
                      ? "pause"
                      : "play"
                  }
                  color={"#fff"}
                  size={20}
                />
              </View>
            </Pressable>
            <Slider
              style={styles.slider}
              // value={
              //   playbackInstanceInfo.duration
              //     ? playbackInstanceInfo.position /
              //       playbackInstanceInfo.duration
              //     : 0
              // }
              value={
                playbackInstanceInfo.duration
                  ? panProgress / playbackInstanceInfo.duration
                  : 0
              }
              minimumTrackTintColor={Colors.light.tint}
              maximumTrackTintColor="hsla(0,0%,100%,.5)"
              thumbTintColor="#fff"
              onSlidingComplete={async (e) => {
                const position = e * playbackInstanceInfo.duration;
                if (video.current) {
                  await video.current.setStatusAsync({
                    positionMillis: position,
                    shouldPlay: true,
                  });
                }
                setPlaybackInstanceInfo({
                  ...playbackInstanceInfo,
                  position,
                });
              }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                marginRight: 12,
                fontWeight: "700",
                transform: [
                  {
                    translateY: 1,
                  },
                ],
                // paddingHorizontal: 4,
                // lineHeight: 18
              }}
            >
              {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.position)}
              /
              {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.duration)}
            </Text>
            <Pressable>
              <View style={styles.icon}>
                <FontAwesome5 name="expand" color={"#fff"} size={20} />
              </View>
            </Pressable>
            {/* </ImageBackground> */}
          </View>
        ) : (
          // playbackInstanceInfo.state !== PlaybackStates.Loading &&
          <View style={styles.footProgress}>
            <View
              style={{
                backgroundColor: Colors.light.tint,
                height: "100%",
                width:
                  playbackInstanceInfo.duration === 0
                    ? 0
                    : (playbackInstanceInfo.position /
                        playbackInstanceInfo.duration) *
                        100 +
                      "%",
                // width:
                //   (playbackInstanceInfo.position /
                //     playbackInstanceInfo.duration) *
                //   WIDTH,
              }}
            ></View>
          </View>
        )}

        {/* <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()
          }
        /> */}
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            // zIndex: 1000,
          },
        ]}
      >
        {!(
          playbackInstanceInfo.state === PlaybackStates.Loading ||
          playbackInstanceInfo.state === PlaybackStates.Error
        ) && <Danmu data={danmuData} ref={danmukuRef} />}
      </View>
    </View>
  );
});

export default VideoPlayer;

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoController: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
  },
  header: {
    paddingHorizontal: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    // left: 0,
    // display: "flex",
    flexDirection: "row",
    height: 36,
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#fff",
  },
  backButton: {},
  middleContainer: {
    flex: 1,
    // marginVertical: 36,
    position: "absolute",
    left: 0,
    top: 36,
    bottom: 36,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footContainer: {
    // height: 36,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    alignContent: "center",
    paddingHorizontal: 16,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    flex: 1,
  },
  footProgress: {
    height: 3,
    position: "absolute",
    width: "100%",
    bottom: 0,
    // alignItems: 'center',
    // justifyContent: 'center',
    left: 0,
    right: 0,
    // backgroundColor: '#fff',
    // backgroundColor: Colors.light.tint
  },
});
