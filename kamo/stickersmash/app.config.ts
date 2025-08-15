import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    EXPO_PUBLIC_CESDK_LICENSE: process.env.EXPO_PUBLIC_CESDK_LICENSE,
  },
});
