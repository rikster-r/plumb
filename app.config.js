module.exports = {
  expo: {
    name: 'Plumb',
    slug: 'plumb',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icons/mainIconWithBackground.png',
    scheme: 'plumb',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      edgeToEdgeEnabled: true,
      package: 'com.riksterr.plumb',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/icons/mainIcon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#3b639d',
        },
      ],
      'expo-secure-store',
      [
        'react-native-edge-to-edge',
        {
          android: {
            parentTheme: 'Default',
            enforceNavigationBarContrast: false,
          },
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/icons/mainIconWithBackground.png',
          defaultChannel: 'default',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '99badb8d-3b90-4bfe-9d1d-52aaff8032a9',
      },
    },
    owner: 'riksterr',
    build: {
      development: {
        developmentClient: true,
        distribution: 'internal',
      },
      preview: {
        distribution: 'internal',
        android: {
          buildType: 'apk',
        },
      },
      production: {
        distribution: 'internal',
        android: {
          buildType: 'apk',
        },
      },
    },
  },
};
