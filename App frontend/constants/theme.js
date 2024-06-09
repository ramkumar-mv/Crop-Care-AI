import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const theme = {
    bgWhite: opacity => `rgba(255, 255,255, ${opacity})`
}

export const COLORS = {
    primary: "#7F5DF0", // Light purple
    secondary: "#5D2DFD", // Dark purple

    white: "#fff",
    black: "#000000",
    green: "#37E39F",
    red: "#F9A8BA",
    gray: "#6A6A6A",
    lightGray: "#dbdbdb",
    lightGray1: "#f5f6fa",
};
export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height,
};
export const FONTS = {};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
