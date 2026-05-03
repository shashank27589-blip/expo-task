import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuthError, requestOtp } from "../store/slices/authSlice";
import { palette } from "../theme/colors";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Login"> & { isDark: boolean };

export function LoginScreen({ navigation, isDark }: Props) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");
  const theme = palette(isDark);

  async function submit() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      setLocalError("Enter a valid email address");
      return;
    }

    setLocalError("");
    dispatch(clearAuthError());
    const result = await dispatch(requestOtp({ email: normalizedEmail, name: name.trim() || undefined }));
    if (requestOtp.fulfilled.match(result)) {
      navigation.navigate("VerifyOtp", { email: normalizedEmail, name: name.trim() || undefined });
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Project Task Manager</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Sign in with a one-time code to manage your work.</Text>
        <TextField
          isDark={isDark}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={localError}
          placeholder="you@example.com"
        />
        <TextField isDark={isDark} label="Name" value={name} onChangeText={setName} placeholder="Optional" />
        {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
        <Button isDark={isDark} title="Send OTP" onPress={submit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 16, lineHeight: 22, marginBottom: 12 },
  error: { fontSize: 14, fontWeight: "600" }
});
