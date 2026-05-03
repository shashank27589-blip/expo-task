import "react-native-gesture-handler";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { persistor, RootState, store } from "./src/store";
import { colors } from "./src/theme/colors";

function AppShell() {
  const systemScheme = useColorScheme();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "system" ? systemScheme === "dark" : themeMode === "dark";

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <RootNavigator isDark={isDark} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
            <ActivityIndicator />
          </View>
        }
        persistor={persistor}
      >
        <AppShell />
      </PersistGate>
    </Provider>
  );
}
