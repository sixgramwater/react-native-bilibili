import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ReplyItem, { ReplyItemProps } from "../../components/reply/replyItem";
import { FlatList } from "react-native-gesture-handler";
import { fetchReplyLazy } from "../../api";
import { ReplayItem } from "../../components/reply/types";

const ReplyInfo = ({ avid }: { avid: number }) => {
  const [replyList, setReplyList] = useState<ReplyItemProps[]>([]);
  const fetchData = () => {
    return fetchReplyLazy(avid).then((res) => {
      const mappedReplyList: ReplyItemProps[] = res.data.replies.map(
        (reply: ReplayItem) => {
          return {
            rpid: reply.rpid,
            oid: reply.oid,
            like: reply.like,
            rcount: reply.rcount,
            member: {
              mid: reply.member.mid,
              uname: reply.member.uname,
              avatar: reply.member.avatar,
            },
            replyControl: reply.reply_control,
            ctime: reply.ctime,
            message: reply.content.message,
            replies: reply.replies?.map((item) => {
              return {
                uname: item.member.uname,
                message: item.content.message,
                mid: item.mid,
              };
            }),
          };
        }
      );
      setReplyList(mappedReplyList);
    });
  };
  useEffect(() => {
    fetchData();
  }, [avid]);
  return (
    <FlatList
      data={replyList}
      renderItem={({ item }) => <ReplyItem {...item} key={item.rpid}/>}
    />
  );
};

export default ReplyInfo;

const styles = StyleSheet.create({});
