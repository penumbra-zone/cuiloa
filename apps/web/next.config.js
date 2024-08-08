// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "standalone",
   experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
   },
};

module.exports = nextConfig;
