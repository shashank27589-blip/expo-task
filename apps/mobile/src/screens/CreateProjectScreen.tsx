import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createProject } from "../store/slices/projectsSlice";
import { palette } from "../theme/colors";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "CreateProject"> & { isDark: boolean };

export function CreateProjectScreen({ navigation, isDark }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.projects.loading);
  const theme = palette(isDark);

  async function submit() {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    setError("");
    const result = await dispatch(createProject({ title: title.trim(), description: description.trim() }));
    if (createProject.fulfilled.match(result)) {
      navigation.goBack();
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextField isDark={isDark} label="Title" value={title} onChangeText={setTitle} placeholder="Website redesign" />
      <TextField
        isDark={isDark}
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="What this project is about"
        multiline
        style={styles.textarea}
      />
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
      <Button isDark={isDark} title="Create Project" onPress={submit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  textarea: { minHeight: 110, paddingTop: 12, textAlignVertical: "top" },
  error: { fontWeight: "600" }
});
