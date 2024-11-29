import * as SecureStore from "expo-secure-store";

export async function saveToSecureStore(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function loadFromSecureStore(key) {
  return await SecureStore.getItemAsync(key);
}

export async function removeFromSecureStore(key) {
  await SecureStore.deleteItemAsync(key);
}
