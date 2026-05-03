import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteTask, fetchTasks, updateTask } from "../store/slices/tasksSlice";
import { palette } from "../theme/colors";
import type { RootStackParamList, Task } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "ProjectDetail"> & { isDark: boolean };

export function ProjectDetailScreen({ navigation, route, isDark }: Props) {
  const { projectId } = route.params;
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.byProjectId[projectId] || []);
  const loading = useAppSelector((state) => state.tasks.loadingByProjectId[projectId]);
  const error = useAppSelector((state) => state.tasks.error);
  const theme = palette(isDark);

  useEffect(() => {
    dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Button isDark={isDark} title="New Task" onPress={() => navigation.navigate("CreateTask", { projectId })} />
      {loading ? <ActivityIndicator style={styles.loader} /> : null}
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tasks.length === 0 ? styles.emptyList : styles.list}
        refreshing={Boolean(loading)}
        onRefresh={() => dispatch(fetchTasks(projectId))}
        ListEmptyComponent={!loading ? <Text style={[styles.empty, { color: theme.muted }]}>No tasks yet.</Text> : null}
        renderItem={({ item }) => (
          <TaskRow
            task={item}
            isDark={isDark}
            onToggle={() =>
              dispatch(
                updateTask({
                  taskId: item.id,
                  projectId,
                  status: item.status === "completed" ? "pending" : "completed"
                })
              )
            }
            onDelete={() => dispatch(deleteTask({ taskId: item.id, projectId }))}
          />
        )}
      />
    </View>
  );
}

function TaskRow({
  task,
  isDark,
  onToggle,
  onDelete
}: {
  task: Task;
  isDark: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const theme = palette(isDark);
  const complete = task.status === "completed";

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable onPress={onToggle} style={styles.taskMain}>
        <Text style={[styles.check, { color: complete ? theme.success : theme.muted }]}>{complete ? "[x]" : "[ ]"}</Text>
        <View style={styles.taskText}>
          <Text style={[styles.taskTitle, { color: theme.text, textDecorationLine: complete ? "line-through" : "none" }]}>
            {task.title}
          </Text>
          {task.dueDate ? <Text style={[styles.due, { color: theme.muted }]}>Due {new Date(task.dueDate).toDateString()}</Text> : null}
        </View>
      </Pressable>
      <Pressable onPress={onDelete} hitSlop={10}>
        <Text style={[styles.delete, { color: theme.danger }]}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { marginTop: 24 },
  error: { marginVertical: 8, fontWeight: "600" },
  list: { gap: 10, paddingVertical: 16, paddingBottom: 32 },
  emptyList: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
  empty: { fontSize: 16, fontWeight: "600" },
  card: { borderWidth: 1, borderRadius: 8, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  taskMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  check: { fontSize: 24, width: 28 },
  taskText: { flex: 1, gap: 4 },
  taskTitle: { fontSize: 16, fontWeight: "800" },
  due: { fontSize: 12, fontWeight: "600" },
  delete: { fontSize: 14, fontWeight: "800" }
});
