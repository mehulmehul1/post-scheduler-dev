import Constants from 'expo-constants';

/**
 * Retrieve the CESDK license key from Expo config or env.
 * Throws an error if the key is missing so callers do not accidentally
 * proceed without a valid license.
 */
export const getCESDKLicense = (): string => {
  const key =
    (Constants?.expoConfig?.extra as any)?.EXPO_PUBLIC_CESDK_LICENSE ??
    (Constants as any)?.manifestExtra?.EXPO_PUBLIC_CESDK_LICENSE ??
    process.env.EXPO_PUBLIC_CESDK_LICENSE;

  if (!key) {
    throw new Error('Missing CESDK license key');
  }

  return key;
};
