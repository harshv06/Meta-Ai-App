import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";

const EmptyComponent = ({ isTyping }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const data = [
    "🧠 AI Trends 2024",
    "🚀 Space Exploration Update",
    "🕹 Gaming News",
    "📈 Stock Market Insights",
    "🎬 Movie Recommendations",
    "📔 Book Summaries",
    "🍚 Best Recipies",
    "🗞 Global News",
    "🎵 Music Hits",
    "🏅 Sports Highlights",
    "🎭 Art Exhibitions",
    "🧩 Puzzle of the Day",
    "💡 Innovate Ideas",
    "💸 Financial Tips",
    "🏠 Home Decore",
    "👠Fashion Trends",
    "🚗 Car Reviews",
    "📱 Gadget Reviews",
    "🐜 Gardening Tips",
    "🐶 Per Care Advice",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          style={[styles.img, { transform: [{ rotate }] }]}
          source={require("../assets/logo_t.png")}
        />
      </View>
      <CustomText size={RFValue(24)}>Ask Me Anything</CustomText>
      {!isTyping && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          centerContent={true}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {data?.slice(0, 7).map((item, index) => (
                <TouchableOpacity key={index} style={styles.touchableItem}>
                  <Text style={styles.touchableText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {data?.slice(7, 14).map((item, index) => (
                <TouchableOpacity key={index} style={styles.touchableItem}>
                  <Text style={styles.touchableText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {data?.slice(14, 21).map((item, index) => (
                <TouchableOpacity key={index} style={styles.touchableItem}>
                  <Text style={styles.touchableText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: RFValue(130),
    height: RFValue(130),
  },

  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  scrollContainer: {
    maxHeight: RFValue(150),
    marginLeft: 5,
    minHeight: RFValue(120),
    marginTop:10
  },

  scrollContent: {
    alignItems: "center",
    gap: 10,
  },

  touchableItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 30,
    marginHorizontal: 5,
    marginVertical: 3,
  },

  touchableText: {
    fontSize: RFValue(12),
    color: "white",
  },
});
