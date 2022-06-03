import "fastestsmallesttextencoderdecoder";
import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
// import zlib from "zlib";
import { inflate } from "pako";

// import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useInterval } from "../../hooks/useInterval";
// import 'fast-text-encoding';

type badgeType = {
  id?: number;
  name: string;
  level: number | string;
  borderColor: string;
  backgroundColorLeft: string;
  backgroundColorRight: string;
  levelColor: string;
  upmid: number;
};

export interface LiveMessageItem {
  id: string | number;
  badge: badgeType | null;
  fontSize: number;
  fontColor: string;
  username: string;
  mid: string | number;
  usernameColor: string;
  content: string;
}

type LiveGiftItem = {};

enum CONNECT_STATUS {
  CONNECTED = 1,
  NOT_CONNECTED = 0,
}

const bufferDecoder = (buffer: Uint8Array): Array<Object> => {
  const arr = new Uint8Array(buffer);
  const view = new DataView(arr.buffer);
  const packs = [];
  let offset = 0;
  while (offset < arr.byteLength) {
    const protocol = view.getInt16(6 + offset);
    const type = view.getInt32(8 + offset);
    if (type === 5) {
      const section = arr.slice(
        offset + view.getInt16(4 + offset),
        view.getInt32(offset) + offset
      );
      if (protocol === 0) {
        packs.push(JSON.parse(new TextDecoder().decode(section)));
      }
      if (protocol === 2) {
        packs.push(...bufferDecoder(inflate(section)));
      }
    }
    offset += view.getInt32(offset);
  }
  return packs;
};

const processMessage = (rawData: any) => {
  if (rawData.cmd.startsWith("DANMU_MSG")) {
    const newDanmuItem: LiveMessageItem = {
      id: rawData.info[9][1],
      mid: rawData.info[2][0],
      username: rawData.info[2][1],
      content: rawData.info[1],
      usernameColor: rawData.info[2][7] === "" ? "#9499A0" : rawData.info[2][7],
      fontColor: colorToHex(rawData.info[0][3]),
      fontSize: rawData.info[0][2],
      badge:
        rawData.info[3].length !== 0
          ? {
              level: rawData.info[3][0],
              name: rawData.info[3][1],
              // roomid: rawData.info[3][3],
              levelColor: colorToHex(rawData.info[3][4]),
              borderColor: colorToHex(rawData.info[3][7]),
              backgroundColorLeft: colorToHex(rawData.info[3][8]),
              backgroundColorRight: colorToHex(rawData.info[3][9]),
              upmid: rawData.info[3][12],
            }
          : null,
    };
    return newDanmuItem;
  }
};

const colorToHex = (color: string | number) => {
  return "#" + Number(color).toString(16).padStart(6, "0");
};

const LiveMessageList = ({ roomid }: { roomid: number }) => {
  const [messageList, setMessageList] = useState<LiveMessageItem[]>([]);
  const [status, setStatus] = useState(CONNECT_STATUS.NOT_CONNECTED);
  const socket = useRef<WebSocket>();
  const shouldSendHeart = status === CONNECT_STATUS.CONNECTED;
  useEffect(() => {
    connect(21457197);
    return () => {
      socket.current?.close();
    };
  }, []);
  function connect(roomid: number) {
    socket.current = new WebSocket("wss://broadcastlv.chat.bilibili.com/sub");
    socket.current.binaryType = "arraybuffer";
    socket.current.onopen = (e) => {
      const obj = {
        uid: 0,
        roomid: Number(roomid),
        protover: 2,
        platform: "web",
        clientver: "1.5.15",
      };
      sendPackageObj(7, obj);
      setStatus(CONNECT_STATUS.CONNECTED);
      console.log("connected");
    };
    socket.current.onmessage = (e) => {
      // if (Date.now() - this.lastRenderInvoke > 1000) {
      //   console.log('Window Inactive');
      //   return;
      // }
      const packs = bufferDecoder(e.data);
      const danmuItem = packs
        .map((pack) => processMessage(pack))
        .filter((item) => item !== undefined) as LiveMessageItem[];
      setMessageList((list) =>
        list
          .slice(
            list.length + danmuItem.length > 50
              ? list.length + danmuItem.length - 50
              : undefined
          )
          .concat(danmuItem)
      );
      // scrollRef.current?.sc
      // console.log(packs);
      // packs.forEach(section => this.proc.formMessage(section, observer));
    };
    socket.current.onerror = (e) => {
      console.log(e);
    };
    socket.current.onclose = () => {
      setStatus(CONNECT_STATUS.NOT_CONNECTED);
    };
  }
  function sendPackageBinary(type: number, body: Uint8Array) {
    const head = new ArrayBuffer(16);
    const headDataView = new DataView(head);
    headDataView.setInt32(0, head.byteLength + body.byteLength);
    headDataView.setInt16(4, 16);
    headDataView.setInt16(6, 1);
    headDataView.setInt32(8, type); // verify
    headDataView.setInt32(12, 1);

    const tmp = new Uint8Array(16 + body.byteLength);
    tmp.set(new Uint8Array(head), 0);
    tmp.set(body, 16);

    socket.current?.send(tmp);
    // this.ws.send(tmp);
  }
  function sendHeartbeat() {
    const body = new TextEncoder().encode("[object Object]");
    sendPackageBinary(2, body);
    console.log("send heartbeat");
  }
  function sendPackageObj(type: number, bufferObj: any) {
    sendPackageBinary(
      type,
      new TextEncoder().encode(JSON.stringify(bufferObj))
    );
  }
  useInterval(sendHeartbeat, shouldSendHeart ? 30000 : null);
  return (
    <View style={{ flex: 1, paddingHorizontal: 12 }}>
      <FlatList
        data={messageList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <LiveMessageItem {...item} />}
      />
      {/* <LiveMessageItem
        username="sixgramwater"
        content="测试弹幕"
        usernameColor="#9499A0"
        mid={123}
        id={123}
        fontSize={24}
        fontColor={"#000"}
        badge={{
          name: "中单",
          level: 12,
          borderColor: "#be6686",
          backgroundColorLeft: "#be6686",
          backgroundColorRight: "##be6686",
          levelColor: "#be6686",
          upmid: 12345,
        }}
      /> */}
    </View>
  );
};

export default LiveMessageList;

const LiveMessageItem: React.FC<LiveMessageItem> = React.memo((props) => {
  const { username, usernameColor, badge, content } = props;
  return (
    <View style={styles.liveMessageContainer}>
      {badge && (
        <View
          style={{
            borderColor: badge.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            flexDirection: "row",
            marginRight: 3,
          }}
        >
          <View
            style={{
              position: "relative",
              backgroundColor: badge.backgroundColorLeft,
              paddingHorizontal: 4,
              justifyContent: "center",
            }}
          >
            {/* <LinearGradient
              colors={[badge.backgroundColorLeft, badge.backgroundColorRight]}
              style={StyleSheet.absoluteFill}
            /> */}
            <Text
              style={{ fontSize: 12, color: "#fff", justifyContent: "center" }}
            >
              {badge.name}
            </Text>
          </View>
          <Text
            style={{
              color: badge.levelColor,
              paddingHorizontal: 2,
              backgroundColor: "#fff",
              fontSize: 12,
            }}
          >
            {badge.level}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row" }}>
        <Text style={{ color: usernameColor ?? "#9499A0", fontSize: 13 }}>
          {username}:{" "}
        </Text>
        <Text style={{ color: "#000", fontSize: 13 }}>{content}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  liveMessageContainer: {
    flexDirection: "row",
    paddingVertical: 6,
    alignItems: "center",
  },
});
