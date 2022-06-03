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
import { LinearGradient } from "expo-linear-gradient";

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
  // cid?: number;
  showDanmu?: boolean;
}
const LiveVideoPlayer: React.FC<VideoPlayerProps> = React.memo((props) => {
  const { src } = props;
  // useEffect(() => {
  // const mse = new MediaSource();
  //   mse.addEventListener('sourceopen', )
  // }, [])
  // let initialShow = props.defaultControlsVisible;
  // let playbackInstance: Video | null = null;
  // // let controlsTimer: NodeJS.Timeout | null = null;
  // let fetchTimer: NodeJS.Timeout | null = null;
  const video = React.useRef<Video>(null);
  // const [status, setStatus] = React.useState<any>({});
  // const [errorMessage, setErrorMessage] = useState("");
  // const [controlsState, setControlsState] = useState(
  //   props.defaultControlsVisible ? ControlStates.Visible : ControlStates.Hidden
  // );
  // const [panProgress, setPanProgress] = useState(0);
  // const [volume, setVolume] = useState(0.4);
  // const [brightness, setBrightness] = useState(0.5);
  // const [brightnessPermitted, setBrightnessPermitted] = useState(false);
  // const [showControlModal, setShowControlModal] = useState<ShowControlModal>(
  //   ShowControlModal.Hidden
  // );
  // const [isPanning, setIsPanning] = useState(false);
  // const [danmuData, setDanmuData] = useState<DanmuType[]>([]);
  // const danmukuRef = useRef<DanmakuRef>(null);
  // const controlsTimer = useRef<NodeJS.Timeout | null>(null);
  // useEffect(() => {
  //   if (!cid || cid === -1) return;
  //   fetchDanmuXml(cid).then((value) => {
  //     const danmuList = parseDanmuToJSON(value);
  //     console.log(`fetched ${danmuList.length} danmu`);
  //     const sortedList = danmuList
  //       .slice(0, danmuList.length > 500 ? 500 : -1)
  //       .sort((a, b) => a.startTime - b.startTime)
  //       .map((item) => {
  //         return {
  //           ...item,
  //           startTime: item.startTime * 1000,
  //         };
  //       });
  //     setDanmuData(sortedList);
  //   });
  // }, [cid]);

  // const handleClickButton = () => {};
  const navigation = useNavigation<any>();
  
  
  return (
    <View style={styles.videoContainer}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: src ? src : "",
          overrideFileExtensionAndroid: 'm3u8'
          // ? src
          // : "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        }}
        // progressUpdateIntervalMillis={1000}
        // useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls={true}
        isLooping={true}
        
        shouldPlay={true}
        volume={1}
        // isLooping
        // onPlaybackStatusUpdate={(status) => updatePlaybackCallback(status)}
      />
      
      {/* <View
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
        ) && (
          <Danmu
            data={danmuData}
            ref={danmukuRef}
            shouldPlay={playbackInstanceInfo.state === PlaybackStates.Playing}
          />
        )}
      </View> */}
    </View>
  );
});

export default LiveVideoPlayer;

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
