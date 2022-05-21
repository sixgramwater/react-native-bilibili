import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORE_KEYS = {
  SEARCH_HISTORY: "search_history",
};

export const store_get = (key: string) =>
  AsyncStorage.getItem(key).then((value) => (value ? JSON.parse(value) : null));

export const store_set = (key: string, value: any) =>
  AsyncStorage.setItem(key, JSON.stringify(value));

export const store_push = async (key: string, value: any) => {
  let list: unknown = await store_get(key);
  if (list instanceof Array) {
    list.push(value);
  } else {
    list = [value];
  }
  console.log(list);
  return await store_set(key, list);
};
