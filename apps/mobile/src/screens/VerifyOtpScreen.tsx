import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { verifyOtp } from "../store/slices/authSlice";
import { palette } from "../theme/colors";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "VerifyOtp"> & { isDark: boolean };

export function VerifyOtpScreen({ route, isDark }: Props) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const theme = palette(isDark);

  function submit() {
    if (!/^\d{6}$/.test(otp)) {
      setLocalError("Enter the 6 digit OTP");
      return;
    }

    setLocalError("");
    dispatch(verifyOtp({ email, otp }));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Verify OTP</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Enter the code sent to {email}.</Text>
        <TextField
          isDark={isDark}
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          error={localError}
          placeholder="123456"
        />
        {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
        <Button isDark={isDark} title="Verify and Continue" onPress={submit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 16, lineHeight: 22 },
  error: { fontSize: 14, fontWeight: "600" }
});
