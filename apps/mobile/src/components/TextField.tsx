import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { palette } from "../theme/colors";

type Props = TextInputProps & {
  label: string;
  error?: string;
  isDark: boolean;
};

export function TextField({ label, error, isDark, style, ...props }: Props) {
  const theme = palette(isDark);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.muted}
        style={[
          styles.input,
          { backgroundColor: theme.surface, borderColor: error ? theme.danger : theme.border, color: theme.text },
          style
        ]}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6
  },
  label: {
    fontSize: 13,
    fontWeight: "700"
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16
  },
  error: {
    fontSize: 12
  }
});
