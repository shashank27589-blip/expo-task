import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "system" | "light" | "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "system" as ThemeMode },
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    }
  }
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
