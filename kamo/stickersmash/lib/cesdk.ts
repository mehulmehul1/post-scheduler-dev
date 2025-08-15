import Constants from 'expo-constants';

export const getCESDKLicense = (): string | undefined =>
  (Constants?.expoConfig?.extra as any)?.EXPO_PUBLIC_CESDK_LICENSE ??
  (Constants as any)?.manifestExtra?.EXPO_PUBLIC_CESDK_LICENSE ??
  process.env.EXPO_PUBLIC_CESDK_LICENSE;
