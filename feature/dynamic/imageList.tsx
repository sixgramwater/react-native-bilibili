import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import React from "react";

const WIDTH = Dimensions.get("screen").width;

export interface ImageListProps {
  imgs: string[];
  onSelect?: (index: number) => void;
}

const ImageList: React.FC<ImageListProps> = (props) => {
  const { imgs, onSelect } = props;
  const handlePress = (index: number) => {
    onSelect && onSelect(index);
  };
  return (
    <View style={styles.imageListContainer}>
      {imgs.length >= 1 ? (
        imgs.map((img, index) => (
          <Pressable
            style={[
              styles.imageItemContainer,
              (index % 3 === 0 || index % 3 === 1) && { marginRight: 6 },
            ]}
            onPress={() => handlePress(index)}
            key={index}
          >
            <Image
              source={{ uri: img }}
              resizeMode={"cover"}
              style={styles.image}
            />
          </Pressable>
        ))
      ) : (
        <View>
          <Text>No images</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(ImageList);

const styles = StyleSheet.create({
  imageListContainer: {
    flexDirection: "row",
  },
  imageItemContainer: {
    width: (WIDTH - 24 - 6 * 2) / 3,
    height: (WIDTH - 24 - 6 * 2) / 3,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  image: {
    width: (WIDTH - 24 - 6 * 2) / 3,
    height: (WIDTH - 24 - 6 * 2) / 3,
  },
});
