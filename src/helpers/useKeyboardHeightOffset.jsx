import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export default function useKeyboardHeightOffset() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", (e) =>
      setKeyboardHeight(0)
    );
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", (e) =>
      setKeyboardHeight(0)
    );
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
      keyboardWillHide.remove();
      keyboardWillShow.remove();
    };
  }, []);
  return keyboardHeight;
}
