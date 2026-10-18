import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ttensor.app",
  appName: "T-Tensor",
  webDir: "dist",
  android: {
    backgroundColor: "#f6f4fb",
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_ttensor",
      iconColor: "#6d28d9",
    },
  },
};

export default config;
