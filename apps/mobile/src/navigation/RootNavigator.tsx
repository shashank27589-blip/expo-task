import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Button as HeaderButton } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMe, logout } from "../store/slices/authSlice";
import type { RootStackParamList } from "../types";
import { CreateProjectScreen } from "../screens/CreateProjectScreen";
import { CreateTaskScreen } from "../screens/CreateTaskScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ProjectDetailScreen } from "../screens/ProjectDetailScreen";
import { ProjectsScreen } from "../screens/ProjectsScreen";
import { VerifyOtpScreen } from "../screens/VerifyOtpScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator({ isDark }: { isDark: boolean }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch, token]);

  if (!token) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">{(props) => <LoginScreen {...props} isDark={isDark} />}</Stack.Screen>
        <Stack.Screen name="VerifyOtp">{(props) => <VerifyOtpScreen {...props} isDark={isDark} />}</Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Projects"
        options={{
          title: "Projects",
          headerRight: () => <HeaderButton title="Logout" onPress={() => dispatch(logout())} />
        }}
      >
        {(props) => <ProjectsScreen {...props} isDark={isDark} />}
      </Stack.Screen>
      <Stack.Screen name="CreateProject" options={{ title: "New Project" }}>
        {(props) => <CreateProjectScreen {...props} isDark={isDark} />}
      </Stack.Screen>
      <Stack.Screen name="ProjectDetail" options={({ route }) => ({ title: route.params.title })}>
        {(props) => <ProjectDetailScreen {...props} isDark={isDark} />}
      </Stack.Screen>
      <Stack.Screen name="CreateTask" options={{ title: "New Task" }}>
        {(props) => <CreateTaskScreen {...props} isDark={isDark} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
