import { Poppins, Work_Sans } from "next/font/google";
import localFont from "next/font/local";

// NOTE: The approach taken for handling multiple fonts is that we globally insert poppins (all normal text) and IoveskaTerm (pre/code/technical info)
//       but only import workSans for the Navbar because it is used exclusively as a display type font.

export const poppins = Poppins({
  // We might not actually need all of these weights. I just selected defaulted to normal, medium, semi, and bold.
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const ioveskaTerm = localFont({
  variable: "--font-iosevka-mono",
  src: "../fonts/IosevkaTerm-Regular.woff2",
  style: "normal",
  weight: "400",
});
