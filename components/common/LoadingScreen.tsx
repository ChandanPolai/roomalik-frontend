// components/common/LoadingScreen.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import { APP_IMAGES } from '../../constants/config';
import '../../global.css';

const LoadingScreen: React.FC = () => {
  // Animation value for logo
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Logo zoom in/out animation
    const zoomAnimation = Animated.loop(
      Animated.sequence([
        // Zoom In
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Zoom Out
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animation
    zoomAnimation.start();

    // Cleanup
    return () => {
      zoomAnimation.stop();
    };
  }, [scaleAnim]);

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-white">
      <View className="items-center">
        {/* Animated Logo */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Image
            source={APP_IMAGES.SPLASH_LOGO}
            className="w-32 h-32 mb-6"
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default LoadingScreen;