import localFont from "next/font/local";

export const ioveskaSans = localFont({
  variable: "--font-iosevka-sans",
  src: [
    {
      path: "../fonts/IosevkaSans-Bold.woff2",
      style: "normal",
      weight: "700",
    },
    {
      path: "../fonts/IosevkaSans-BoldItalic.woff2",
      style: "italic",
      weight: "700",
    },
    {
      path: "../fonts/IosevkaSans-ExtraBold.woff2",
      style: "normal",
      weight: "800",
    },
    {
      path: "../fonts/IosevkaSans-ExtraBoldItalic.woff2",
      style: "italic",
      weight: "800",
    },
    {
      path: "../fonts/IosevkaSans-ExtraLight.woff2",
      style: "normal",
      weight: "200",
    },
    {
      path: "../fonts/IosevkaSans-ExtraLightItalic.woff2",
      style: "italic",
      weight: "200",
    },
    {
      path: "../fonts/IosevkaSans-Heavy.woff2",
      style: "normal",
      weight: "900",
    },
    {
      path: "../fonts/IosevkaSans-HeavyItalic.woff2",
      style: "italic",
      weight: "900",
    },
    {
      path: "../fonts/IosevkaSans-Italic.woff2",
      style: "italic",
      weight: "400",
    },
    {
      path: "../fonts/IosevkaSans-Light.woff2",
      style: "normal",
      weight: "300",
    },
    {
      path: "../fonts/IosevkaSans-LightItalic.woff2",
      style: "italic",
      weight: "300",
    },
    {
      path: "../fonts/IosevkaSans-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../fonts/IosevkaSans-MediumItalic.woff2",
      style: "italic",
      weight: "500",
    },
    {
      path: "../fonts/IosevkaSans-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/IosevkaSans-SemiBold.woff2",
      style: "normal",
      weight: "600",
    },
    {
      path: "../fonts/IosevkaSans-SemiBoldItalic.woff2",
      style: "italic",
      weight: "600",
    },
    {
      path: "../fonts/IosevkaSans-Thin.woff2",
      style: "normal",
      weight: "100",
    },
    {
      path: "../fonts/IosevkaSans-ThinItalic.woff2",
      style: "italic",
      weight: "100",
    },
  ],
});

export const ioveskaTerm = localFont({
  variable: "--font-iosevka-mono",
  src: "../fonts/IosevkaTerm-Regular.woff2",
  style: "normal",
  weight: "400",
});
