/**
 * MEANLY - Intro Welcome Screens
 * Beautiful 3-screen introduction for first-time users
 */

import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Pressable,
  StatusBar,
  Dimensions,
  ImageBackground,
  FlatList,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../src/components/common';
import { useUserStore } from '../../src/stores/userStore';
import { BrandColors, BorderRadius, Spacing } from '../../src/constants/colors';

const { width, height } = Dimensions.get('window');

// Intro screen data
const INTRO_SCREENS = [
  {
    id: '1',
    emoji: '🌍',
    text: 'В современном мире мы всё чаще сталкиваемся с тем, что речь людей становится проще, беднее, лишается глубины и выразительности.',
    icon: 'globe-outline' as const,
  },
  {
    id: '2',
    emoji: '🚀',
    text: 'В MEANLY вас ждёт специальная методика изучения слов, которая поможет не просто пополнить словарный запас, но и научит говорить красиво и убедительно.',
    icon: 'rocket-outline' as const,
  },
  {
    id: '3',
    emoji: '🔥',
    text: 'Мы создали это приложение как ответ на тенденцию простой и заурядной речи. Попробуйте начать — и вы почувствуете, как ваша речь становится сильнее с каждым днём!',
    icon: 'flame-outline' as const,
  },
];

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeWelcomeScreens } = useUserStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < INTRO_SCREENS.length - 1) {
      flatListRef.current?.scrollToIndex({ 
        index: currentIndex + 1, 
        animated: true 
      });
    } else {
      // Complete welcome and go to welcome screen
      completeWelcomeScreens();
      router.replace('/(auth)/welcome');
    }
  };

  const handleSkip = () => {
    completeWelcomeScreens();
    router.replace('/(auth)/welcome');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: typeof INTRO_SCREENS[0] }) => (
    <View style={styles.slide}>
      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Icon Circle */}
        <View style={styles.iconContainer}>
          <BlurView intensity={30} tint="light" style={styles.iconBlur}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </BlurView>
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <BlurView intensity={20} tint="light" style={styles.textBlur}>
            <Text style={styles.mainText}>{item.text}</Text>
          </BlurView>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <ImageBackground
        source={require('../../assets/images/image_fons/hello_screen.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay for better readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />

        {/* Skip Button */}
        <Pressable 
          style={[styles.skipButton, { top: insets.top + 16 }]}
          onPress={handleSkip}
        >
          <BlurView intensity={25} tint="light" style={styles.skipButtonBlur}>
            <Text style={styles.skipText}>Пропустить</Text>
          </BlurView>
        </Pressable>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={INTRO_SCREENS}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        />

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {INTRO_SCREENS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          {/* Next Button - Glass Effect */}
          <Pressable 
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextButtonPressed,
            ]}
            onPress={handleNext}
          >
            <BlurView intensity={40} tint="light" style={styles.nextButtonBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex === INTRO_SCREENS.length - 1 ? 'Начать' : 'Далее'}
                </Text>
                <Ionicons 
                  name={currentIndex === INTRO_SCREENS.length - 1 ? 'checkmark' : 'arrow-forward'} 
                  size={20} 
                  color={BrandColors.white} 
                />
              </LinearGradient>
            </BlurView>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  skipButtonBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    alignItems: 'center',
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: 340,
  },
  iconContainer: {
    marginBottom: 40,
    borderRadius: 60,
    overflow: 'hidden',
  },
  iconBlur: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 56,
  },
  textContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  textBlur: {
    padding: 28,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  mainText: {
    fontSize: 18,
    fontWeight: '500',
    color: BrandColors.white,
    textAlign: 'center',
    lineHeight: 28,
  },
  bottomSection: {
    paddingHorizontal: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  paginationDotActive: {
    backgroundColor: BrandColors.white,
    width: 28,
  },
  nextButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
  },
  nextButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  nextButtonBlur: {
    borderRadius: BorderRadius.button,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.button,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: BrandColors.white,
  },
});
