export const colors = {
  background: "#F6F7F4",
  surface: "#FFFFFF",
  text: "#14213D",
  muted: "#65717C",
  border: "#DCE2E8",
  primary: "#0F766E",
  primaryDark: "#115E59",
  danger: "#B42318",
  warning: "#B7791F",
  success: "#15803D",
  darkBackground: "#101820",
  darkSurface: "#18242F",
  darkText: "#F5F7FA",
  darkMuted: "#A7B1BA",
  darkBorder: "#2A3B47"
};

export function palette(isDark: boolean) {
  return {
    background: isDark ? colors.darkBackground : colors.background,
    surface: isDark ? colors.darkSurface : colors.surface,
    text: isDark ? colors.darkText : colors.text,
    muted: isDark ? colors.darkMuted : colors.muted,
    border: isDark ? colors.darkBorder : colors.border,
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    danger: colors.danger,
    warning: colors.warning,
    success: colors.success
  };
}
