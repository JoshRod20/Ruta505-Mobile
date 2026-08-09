import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingNavButton({
  icon = "menu-outline",
  onPress,
  accessibilityLabel = "Abrir menú",
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.getParent()?.openDrawer();
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: insets.top + 2,
        left: 12,
        zIndex: 20,
        elevation: 20,
      }}
    >
  <TouchableOpacity
  onPress={handlePress}
  accessibilityLabel={accessibilityLabel}
  activeOpacity={0.7}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  style={{
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Ionicons name={icon} size={32} color="#2E7D32" />
</TouchableOpacity>
    </View>
  );
}
