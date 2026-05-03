import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProjects, deleteProject } from "../store/slices/projectsSlice";
import { setThemeMode, ThemeMode } from "../store/slices/themeSlice";
import { palette } from "../theme/colors";
import type { Project, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Projects"> & { isDark: boolean };

export function ProjectsScreen({ navigation, isDark }: Props) {
  const dispatch = useAppDispatch();
  const { items, loading, refreshing, error } = useAppSelector((state) => state.projects);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const theme = palette(isDark);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  function cycleTheme() {
    const next: Record<ThemeMode, ThemeMode> = { system: "light", light: "dark", dark: "system" };
    dispatch(setThemeMode(next[themeMode]));
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.toolbar}>
        <Button isDark={isDark} title="New Project" onPress={() => navigation.navigate("CreateProject")} />
        <Button isDark={isDark} title={`Theme: ${themeMode}`} variant="ghost" onPress={cycleTheme} />
      </View>
      {loading ? <ActivityIndicator style={styles.loader} /> : null}
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={items.length === 0 ? styles.emptyList : styles.list}
        refreshing={refreshing}
        onRefresh={() => dispatch(fetchProjects())}
        ListEmptyComponent={!loading ? <Text style={[styles.empty, { color: theme.muted }]}>No projects yet.</Text> : null}
        renderItem={({ item }) => (
          <ProjectRow
            project={item}
            isDark={isDark}
            onOpen={() => navigation.navigate("ProjectDetail", { projectId: item.id, title: item.title })}
            onDelete={() => dispatch(deleteProject(item.id))}
          />
        )}
      />
    </View>
  );
}

function ProjectRow({
  project,
  isDark,
  onOpen,
  onDelete
}: {
  project: Project;
  isDark: boolean;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const theme = palette(isDark);

  return (
    <Pressable onPress={onOpen} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.cardTop}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{project.title}</Text>
        <Pressable onPress={onDelete} hitSlop={10}>
          <Text style={[styles.delete, { color: theme.danger }]}>Delete</Text>
        </Pressable>
      </View>
      <Text style={[styles.description, { color: theme.muted }]}>{project.description}</Text>
      <Text style={[styles.meta, { color: theme.primary }]}>{project._count?.tasks || 0} tasks</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  toolbar: { gap: 10, marginBottom: 12 },
  loader: { marginTop: 24 },
  error: { marginBottom: 8, fontWeight: "600" },
  list: { gap: 12, paddingBottom: 32 },
  emptyList: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
  empty: { fontSize: 16, fontWeight: "600" },
  card: { borderWidth: 1, borderRadius: 8, padding: 16, gap: 8 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  cardTitle: { flex: 1, fontSize: 18, fontWeight: "800" },
  description: { fontSize: 14, lineHeight: 20 },
  meta: { fontSize: 13, fontWeight: "700" },
  delete: { fontSize: 14, fontWeight: "800" }
});
