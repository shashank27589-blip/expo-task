import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { useAppDispatch } from "../store/hooks";
import { createTask } from "../store/slices/tasksSlice";
import { palette } from "../theme/colors";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "CreateTask"> & { isDark: boolean };

export function CreateTaskScreen({ navigation, route, isDark }: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const theme = palette(isDark);

  async function submit() {
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    let isoDate: string | null = null;
    if (dueDate.trim()) {
      const parsed = new Date(dueDate.trim());
      if (Number.isNaN(parsed.getTime())) {
        setError("Use a valid due date like 2026-05-01");
        return;
      }
      isoDate = parsed.toISOString();
    }

    setError("");
    const result = await dispatch(createTask({ projectId: route.params.projectId, title: title.trim(), dueDate: isoDate }));
    if (createTask.fulfilled.match(result)) {
      navigation.goBack();
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextField isDark={isDark} label="Title" value={title} onChangeText={setTitle} placeholder="Prepare API demo" />
      <TextField
        isDark={isDark}
        label="Due date"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Optional, e.g. 2026-05-01"
      />
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
      <Button isDark={isDark} title="Create Task" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  error: { fontWeight: "600" }
});
