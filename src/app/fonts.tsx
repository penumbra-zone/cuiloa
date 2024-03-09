import localFont from "next/font/local";

export const ioveskaSans = localFont({
  variable: "--font-iosevka-sans",
  src: [
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-Bold.woff2",
      style: "normal",
      weight: "700",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-BoldItalic.woff2",
      style: "italic",
      weight: "700",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-ExtraBold.woff2",
      style: "normal",
      weight: "800",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-ExtraBoldItalic.woff2",
      style: "italic",
      weight: "800",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-ExtraLight.woff2",
      style: "normal",
      weight: "200",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-ExtraLightItalic.woff2",
      style: "italic",
      weight: "200",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-Heavy.woff2",
      style: "normal",
      weight: "900",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-HeavyItalic.woff2",
      style: "italic",
      weight: "900",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-Italic.woff2",
      style: "italic",
      weight: "400",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-Light.woff2",
      style: "normal",
      weight: "300",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-LightItalic.woff2",
      style: "italic",
      weight: "300",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-MediumItalic.woff2",
      style: "italic",
      weight: "500",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-SemiBold.woff2",
      style: "normal",
      weight: "600",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-SemiBoldItalic.woff2",
      style: "italic",
      weight: "600",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-Thin.woff2",
      style: "normal",
      weight: "100",
    },
    {
      path: "../../public/fonts/WOFF2/IosevkaSans-ThinItalic.woff2",
      style: "italic",
      weight: "100",
    },
  ],
});

export const ioveskaTerm = localFont({
  variable: "--font-iosevka-mono",
  src: "../../public/fonts/WOFF2/IosevkaTerm-Regular.woff2",
  style: "normal",
  weight: "400",
});