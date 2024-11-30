import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React, { useState } from "react";
import Svg, { Rect } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";
import LOGO from "../assets/logo_s.jpeg";
import CustomText from "./CustomText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useDispatch } from "react-redux";
import { clearCurrentChat, clearStorage } from "../redux/reducers/chatReducer";
import SideDrawer from "./SideDrawer";

const CustomHeader = ({ chatid, setCurrentChatid, chats }) => {
  const dispatch = useDispatch();
  const onClearChat = async () => {
    await dispatch(clearCurrentChat({ chatid }));
  };
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.subContainer}>
          <TouchableOpacity>
            {/* <Svg height="50" width="50" viewBox="0 0 100 100">
              <Rect
                x="10"
                y="20"
                width={RFValue(40)}
                height={RFValue(5)}
                rx="5"
                fill="white"
              />
              <Rect
                x="10"
                y="35"
                width={RFValue(35)}
                height={RFValue(5)}
                rx="5"
                fill="white"
              />
              <Rect
                x="10"
                y="50"
                width={RFValue(25)}
                height={RFValue(5)}
                rx="5"
                fill="white"
              />
            </Svg> */}
            <Feather
              name="menu"
              size={24}
              color="white"
              onPress={() => setIsVisible(true)}
            />
          </TouchableOpacity>
          <View style={styles.Logo}>
            <Image source={LOGO} style={styles.image} />
            <View>
              <CustomText fontWeight="bold">
                Meta AI{" "}
                <AntDesign name="checkcircle" size={16} color="#27d366" />
              </CustomText>
              <CustomText fontWeight="500" opacity={0.7} size={12}>
                with Llama 3
              </CustomText>
            </View>
          </View>

          <TouchableOpacity onPress={onClearChat}>
            <CustomText size={14} fontWeight="500">
              Clear
            </CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {isVisible && (
        <SideDrawer
          isVisible={isVisible}
          setCurrentChatid={(id) => setCurrentChatid(id)}
          chats={chats}
          currentChatId={chatid}
          onPressHide={() => setIsVisible(false)}
        />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(20,25,46,1)",
    padding: 15,
    borderBottomWidth: 0.18,
    borderBottomColor: "rgba(62,62,63,1)",
  },

  image: {
    height: RFValue(38),
    width: RFValue(38),
    borderRadius: 50,
  },

  subContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  Logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
