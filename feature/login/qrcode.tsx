import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useInterval } from "../../hooks/useInterval";
// import Qrcode from "qrcode";
import QRCode from 'react-native-qrcode-svg';
import { fetchQrcode, qrLogin } from "../../api";
import { AxiosResponse } from "axios";
import CookieManager from "@react-native-cookies/cookies";

const QrcodeLogin = () => {
  const [qrcodeUrl, setQrcodeUrl] = useState<string | undefined>();
  const [key, setKey] = useState<string | undefined>();
  const [logined, setLogined] = useState(false);
  const [status, setStatus] = useState<number | undefined>();

  const shouldPolling = key && !logined;

  useInterval(
    () => {
      requestLoginInterval();
    },
    shouldPolling ? 1000 : null
  );

  const fetchQrImg = () => {
    return fetchQrcode().then((res) => {
      console.log(res.data);
      setQrcodeUrl(res.data.url);
      // Qrcode.toDataURL(res.data.url).then((url) => {
      //   console.log(url);
      //   setQrcodeUrl(url);
      // });
      const key = res.data.oauthKey;
      setKey(key);
    });
  };

  useEffect(() => {
    fetchQrImg();
  }, []);

  const requestLoginInterval = () => {
    return qrLogin(key!).then((axiosRes: AxiosResponse) => {
      let res = axiosRes.data;
      const status = res.status;
      if (status) {
        // 登陆成功
        console.log("login success");
        const cookiesData = axiosRes.headers["set-cookie"];
        // console.log(axiosRes);
        console.log(cookiesData);
        // window.ReactNativeWebView?.postMessage(cookiesData);
        setLogined(true);
        setStatus(undefined);
      } else {
        if (logined || status === -2) return;
        const errorCode = res.data;
        setStatus(errorCode);
      }
      // setStatus(res.status);
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.heading}>扫码登陆</Text>
      <View style={styles.qrContainer}>
        {qrcodeUrl ? (
          <QRCode value={qrcodeUrl}/>
          // <Image source={{ uri: qrcodeUrl }} style={styles.qrcode} />
        ) : (
          <Text>正在加载二维码</Text>
        )}
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>
          {!logined ? "请使用手机客户端扫码登陆" : "登陆成功"}
        </Text>
      </View>
    </View>
  );
};

export default QrcodeLogin;

const styles = StyleSheet.create({
  heading: {
    fontWeight: "700",
    fontSize: 32,
    padding: 24,
  },
  qrContainer: {
    // flex: 1,
    marginVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  qrcode: {
    width: 240,
    height: 240,
  },
  statusContainer: {},
  status: {
    textAlign: "center",
    padding: 12,
  },
});
