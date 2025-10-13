// components/plots/ImageCarousel.tsx
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';
import { API_CONFIG } from '../../constants/config';

interface ImageCarouselProps {
  images: { url: string; caption?: string }[];
  height?: number;
  borderRadius?: number;
}

const { width } = Dimensions.get('window');

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = 240, borderRadius = 16 }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = images.length;

  // Helper function to get full image URL
  const getImageUrl = (url: string) => {
    // If it's already a full URL or local file, return as is
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) {
      return url;
    }
    // Otherwise, prepend the image URL
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const content = useMemo(() => (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {images.map((image, idx) => (
        <View key={idx} style={{ width, height }} className="px-4">
          <View className="w-full h-full overflow-hidden" style={{ borderRadius }}>
            <Image
              source={{ uri: getImageUrl(image.url) }}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
            />
            {image.caption ? (
              <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                <Text className="text-white text-sm text-center font-medium">{image.caption}</Text>
              </View>
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
  ), [images, height, borderRadius]);

  if (total === 0) {
    return (
      <View className="bg-gray-100 items-center justify-center mx-4" style={{ height, borderRadius }} />
    );
  }

  return (
    <View>
      {content}
      <View className="flex-row items-center justify-center mt-3">
        {images.map((_, idx) => (
          <View
            key={idx}
            className={`mx-1 ${idx === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
            style={{ width: idx === activeIndex ? 22 : 8, height: 8, borderRadius: 9999 }}
          />
        ))}
      </View>
      <View className="absolute top-3 right-6 bg-white/90 rounded-full px-2 py-1">
        <Text className="text-gray-800 text-xs font-bold">{activeIndex + 1}/{total}</Text>
      </View>
    </View>
  );
};

export default ImageCarousel;


