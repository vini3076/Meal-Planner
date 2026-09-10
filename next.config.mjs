import { networkInterfaces } from "node:os";

const localDevelopmentOrigins = Object.values(networkInterfaces())
  .flatMap((interfaces) => interfaces || [])
  .filter((network) => network.family === "IPv4" && !network.internal)
  .map((network) => network.address);

/** @type {import("next").NextConfig} */
const nextConfig = {
  allowedDevOrigins: localDevelopmentOrigins,
};

export default nextConfig;
