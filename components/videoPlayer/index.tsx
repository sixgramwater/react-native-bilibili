import {
  ActivityIndicator,
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { AntDesign, createMu, FontAwesome5 } from "@expo/vector-icons";
import navigation from "../../navigation";
import { useNavigation } from "@react-navigation/core";
import Slider from "@react-native-community/slider";
import Colors from "../../constants/Colors";
import { getMinutesSecondsFromMilliseconds } from "../../utils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const WIDTH = Dimensions.get("screen").width;

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
}
const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const { src } = props;
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
  const [volume, setVolume] = useState(1);
  const [showControlModal, setShowControlModal] = useState<ShowControlModal>(
    ShowControlModal.Hidden
  );
  const [isPanning, setIsPanning] = useState(false);

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
      if(!isPanning && status.isLoaded) {
        // console.log('update panprogress')
        setPanProgress(status.positionMillis)
      }
    });
  };
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
      if(controlsTimer) {
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
    })

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
              showControlModal === ShowControlModal.Progress && (
                <View style={styles.modal}>
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                  >
                    {getMinutesSecondsFromMilliseconds(
                      panProgress
                      // playbackInstanceInfo.position
                    )}
                    /
                    {getMinutesSecondsFromMilliseconds(
                      playbackInstanceInfo.duration
                    )}
                  </Text>
                </View>
              )
            )}
          </View>
        </GestureDetector>

        {controlsState === ControlStates.Visible && (
          <View style={styles.footContainer}>
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
                  ? panProgress /
                    playbackInstanceInfo.duration
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
          </View>
        )}

        {/* <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()
          }
        /> */}
      </View>
    </View>
  );
};

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
});
