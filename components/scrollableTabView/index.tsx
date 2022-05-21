import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  Touchable,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view";
import tw from "twrnc";
import Colors from "../../constants/Colors";
import { BaseButton, RectButton } from "react-native-gesture-handler";
import RecScreen from "../../screens/RecScreen";

const WIDTH = Dimensions.get("screen").width;

const tabsData = [
  {
    id: 0,
    name: "直播",
    screen: "live",
    ref: React.createRef<View>(),
  },
  {
    id: 1,
    name: "推荐",
    screen: "recommend",
    ref: React.createRef<View>(),
    component: <RecScreen key={1} />,
  },
  {
    id: 2,
    name: "热门",
    screen: "hot",
    ref: React.createRef<View>(),
  },
  {
    id: 3,
    name: "追番",
    screen: "anime",
    ref: React.createRef<View>(),
  },
  {
    id: 4,
    name: "影视",
    screen: "movie",
    ref: React.createRef<View>(),
  },
];

const Tab = React.forwardRef(
  (
    {
      title,
      activated,
      id,
      textStyle,
      activatedTextStyle,
    }: {
      title: string;
      activated: boolean;
      id: number;
      textStyle?: TextStyle;
      activatedTextStyle?: TextStyle;
    },
    ref: React.ForwardedRef<View>
  ) => {
    return (
      // <RectButton
      //   style={{ alignItems: "center", justifyContent: "center" }}
      //   // onPress={() => {
      //   //   console.log(id);
      //   // }}
      // >
      <View style={styles.tabItem} ref={ref}>
        <Text
          style={[
            styles.tabItemText,
            tw`text-gray-500`,
            textStyle,
            activated && {
              color: Colors.light.tint,
              fontWeight: "600",
              ...activatedTextStyle,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      // </RectButton>
    );
  }
);

type Measure = { x: number; y: number; width: number; height: number };
type TabItem = {
  id: number;
  name: string;
  screen: string;
  component: ReactElement;
};

export interface ScrollableTabsProps {
  tabs?: TabItem[];
  spreadEqual?: boolean;
  tabsContainerStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  tabTextActivatedStyle?: TextStyle;
}
const ScrollableTabs: React.FC<ScrollableTabsProps> = (props) => {
  const {
    tabs: tabsProp,
    spreadEqual,
    tabsContainerStyle,
    indicatorStyle,
    tabTextStyle,
    tabTextActivatedStyle,
  } = props;
  let tabs = tabsProp
    ? tabsProp.map((item) => {
        return {
          ...item,
          ref: React.createRef<View>(),
        };
      })
    : tabsData;
  // const tabs = tabs === undefined ?
  const offsetX = useRef<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activatedTabIndex, setActiveTabIndex] = useState(0);
  const containerRef = useRef<View>(null);
  const pagerRef = useRef<PagerView>(null);
  const [measure, setMeasure] = useState<Measure[]>([]);
  const inputRange = tabs.map((_, i) => i * WIDTH);
  const interpolateWidth =
    measure.length === 0
      ? 0
      : scrollX.interpolate({
          inputRange,
          outputRange: measure.map((m) => m.width),
        });
  const interpolateTranslate =
    measure.length === 0
      ? 0
      : scrollX.interpolate({
          inputRange,
          outputRange: measure.map((m) => m.x),
        });
  useEffect(() => {
    if (containerRef.current) {
      let m: Measure[] = [];
      tabs.forEach((tab) => {
        tab.ref.current?.measureLayout(
          containerRef.current as any,
          (x, y, width, height) => {
            // console.log(x, y, width, height);
            // m.push(1 as any);
            m.push({ x, y, width, height });
            if (m.length === tabs.length) {
              setMeasure(m);
              // console.log(m);
            }
          },
          () => {}
        );
        // console.log(m);
      });
      // console.log(m);
      // setMeasure(m);
      // setMeasure(m);
    }
  }, []);
  // Animated;
  const handleScroll = useCallback((e: PagerViewOnPageScrollEvent) => {
    const position = e.nativeEvent.position;
    const offset = e.nativeEvent.offset;
    // console.log({
    //   offset: e.nativeEvent.offset,
    //   position: e.nativeEvent.position,
    // });
    scrollX.setValue((position + offset) * WIDTH);
    // console.log(scrollX);
  }, []);

  const handleClickTab = (id: number) => {
    // if (!pagerRef.current) return;
    // const id = 1;
    console.log(id);
    pagerRef.current?.setPage(id);
    // requestAnimationFrame(() => pagerRef.current?.setPage(id));
  };
  return (
    // <ScrollView
    //   horizontal={true}
    //   style={styles.scrollView}
    //   pagingEnabled={true}
    //   showsHorizontalScrollIndicator={false}
    // >
    <View style={{ flex: 1 }}>
      <View
        style={[styles.tabsContainer, tabsContainerStyle]}
        ref={containerRef}
      >
        {tabs.map((tab) => {
          return (
            // <TouchableHighlight
            //   onPress={() => {
            //     console.log("click tab" + tab.name);
            //   }}
            //   key={tab.id}
            // >
            <Pressable
              onPress={() => handleClickTab(tab.id)}
              android_ripple={{
                // foreground: true,
                borderless: false,
                radius: 30,
              }}
              key={tab.id}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              {/* <BaseButton key={tab.id} style={{ justifyContent: "center" }} onPress={()=>handleClickTab(tab.id)}> */}
              <Tab
                title={tab.name}
                key={tab.id}
                activated={tab.id === activatedTabIndex}
                ref={tab.ref}
                id={tab.id}
                textStyle={tabTextStyle}
                activatedTextStyle={tabTextActivatedStyle}
              />
              {/* </BaseButton> */}
            </Pressable>
          );
        })}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              width: interpolateWidth,
              left: 0,
              transform: [{ translateX: interpolateTranslate }],
            },
            indicatorStyle,
          ]}
        ></Animated.View>
      </View>
      <PagerView
        style={{ flex: 1 }}
        onPageScroll={handleScroll}
        ref={pagerRef}
        onPageSelected={(e) => setActiveTabIndex(e.nativeEvent.position)}
      >
        {tabs.map((tab) => {
          if (tab.component) {
            // const Comp = tab.component;
            // Comp.key = tab.id;
            return (
              <View style={{ width: WIDTH }} key={tab.id}>
                {/* {tab.component} */}
                {/* <Text>12314</Text> */}
                {tab.component}
              </View>
            );
          }
          return (
            <View style={{ width: WIDTH, padding: 12 }} key={tab.id}>
              <Text style={tw`text-gray-500`}>{tab.name}</Text>
            </View>
          );
        })}
        {/* // <View style={styles.scrollView}> */}
        {/* <Text>ScrollableTabs</Text> */}
        {/* // </View> */}
      </PagerView>
    </View>
  );
};

export default ScrollableTabs;

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
    flex: 1,
    height: 36,
    width: "100%",
    // minWidth: '100%',
    // backgroundColor: "red",
    // width: '100%',
  },
  tabsContainer: {
    width: "100%",
    height: 36,
    backgroundColor: "#fff",
    elevation: 5,

    flexDirection: "row",
    paddingHorizontal: 6,
    position: "relative",
    borderBottomColor: "#f4f5f4",
    borderBottomWidth: 1,
  },
  tabItem: {
    lineHeight: 36,
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 8,
  },
  tabItemText: {},
  tabIndicator: {
    height: 3,
    backgroundColor: Colors.light.tint,
    width: 30,
    position: "absolute",
    left: 10,
    bottom: -1,
  },
});
