import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { palette } from "../theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "danger" | "ghost";
  disabled?: boolean;
  isDark: boolean;
};

export function Button({ title, onPress, loading, variant = "primary", disabled, isDark }: Props) {
  const theme = palette(isDark);
  const isGhost = variant === "ghost";
  const backgroundColor = isGhost ? "transparent" : variant === "danger" ? theme.danger : theme.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor: isGhost ? theme.border : backgroundColor, opacity: pressed || disabled ? 0.72 : 1 }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? theme.primary : "#FFFFFF"} />
      ) : (
        <Text style={[styles.label, { color: isGhost ? theme.primary : "#FFFFFF" }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  label: {
    fontSize: 16,
    fontWeight: "700"
  }
});
