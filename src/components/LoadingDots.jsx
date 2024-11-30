import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";

const LoadingDots = () => {
  const [animatedValues] = useState(
    Array.from({ length: 3 }, () => new Animated.Value(0))
  );

  const startAnimation = () => {
    Animated.loop(
      Animated.stagger(
        100,
        animatedValues.map((val) =>
          Animated.sequence([
            Animated.timing(val, {
              toValue: 0.5,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: true,
            }),

            Animated.timing(val, {
              toValue: 1,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        )
      )
    ).start();
  };

  const resetAnimated = () => {
    animatedValues.forEach((value) => value.setValue(1));
  };

  useEffect(() => {
    startAnimation();
    return () => resetAnimated();
  }, []);

  return (
    <View style={styles.container}>
      {animatedValues?.map((val, index) => (
        <Animated.View
          key={index}
          style={[styles.dots, { transform: [{ scale: val }],marginRight:0 }]}
        />
      ))}
    </View>
  );
};

export default LoadingDots;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    alignSelf: "center",
    marginLeft: 20,
    height: 14,
  },

  dots: {
    width: RFValue(5),
    height: RFValue(5),
    borderRadius: RFValue(50),
    backgroundColor: "grey",
  },
});
