import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";

export interface VideoPlayerProps {
  src?: string;
}
const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const { src } = props;
  const video = React.useRef<Video>(null);
  const [status, setStatus] = React.useState<any>({});
  const handleClickButton = () => {};
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
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <View style={styles.videoController}>
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
    top: 20,
    left: 20,
  },
});
