module.exports = {
  expo: {
    name: 'Дежурный доктор',
    slug: 'doctoronduty',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icons/mainIconWithBackground.png',
    scheme: 'doctoronduty',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      edgeToEdgeEnabled: true,
      useNextNotificationsApi: true,
      package: 'com.riksterr.doctoronduty',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/icons/mainIcon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#fff',
        },
      ],
      'expo-secure-store',
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
