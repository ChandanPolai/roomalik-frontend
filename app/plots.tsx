// app/plots.tsx
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import LoadingScreen from '../components/common/LoadingScreen';
import { PlotCard, PlotDetails, PlotForm } from '../components/plots';
import '../global.css';
import plotsApiService from '../services/api/plots.api';
import { Plot, PlotFormData } from '../types';

type ScreenState = 'list' | 'form' | 'details';

const PlotsScreen = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>('list');
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load plots
  const loadPlots = useCallback(async () => {
    try {
      setError(null);
      const response = await plotsApiService.getAllPlots();
      if (response.success) {
        setPlots(response.data);
      } else {
        setError(response.error || 'Failed to load plots');
      }
    } catch (err: any) {
      console.error('Error loading plots:', err);
      setError(err.response?.data?.error || 'Failed to load plots');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPlots();
  }, [loadPlots]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadPlots();
  }, [loadPlots]);

  // Handle plot creation/update
  const handleSubmitPlot = async (formData: PlotFormData, images: string[]) => {
    try {
      setIsSubmitting(true);
      
      const body = new FormData();
      body.append('name', formData.name);
      body.append('address', JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      }));
      body.append('totalArea', String(Number(formData.totalArea)));
      if (formData.constructionYear) {
        body.append('constructionYear', String(Number(formData.constructionYear)));
      }
      if (formData.facilities?.length) {
        body.append('facilities', JSON.stringify(formData.facilities));
      }
      if (formData.location && (formData.location.lat || formData.location.lng)) {
        body.append('location', JSON.stringify(formData.location));
      }

      // Append only local device images (URIs), server images are already present
      images
        .filter((uri) => uri.startsWith('file://') || uri.startsWith('content://'))
        .slice(0, 10)
        .forEach((uri, idx) => {
          const name = `image_${Date.now()}_${idx}.jpg`;
          // @ts-ignore React Native FormData file
          body.append('images', { uri, name, type: 'image/jpeg' });
        });

      let response;
      if (selectedPlot) {
        response = await plotsApiService.updatePlot(selectedPlot._id, body);
      } else {
        response = await plotsApiService.createPlot(body);
      }

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: selectedPlot ? 'Plot Updated' : 'Plot Created',
          text2: selectedPlot ? 'Plot has been updated successfully' : 'Plot has been created successfully',
        });
        
        // Refresh plots list
        await loadPlots();
        
        // Reset form state
        setScreenState('list');
        setSelectedPlot(null);
      } else {
        throw new Error(response.error || 'Failed to save plot');
      }
    } catch (err: any) {
      console.error('Error saving plot:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.error || 'Failed to save plot. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle plot deletion
  const handleDeletePlot = (plot: Plot) => {
    Alert.alert(
      'Delete Plot',
      `Are you sure you want to delete "${plot.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await plotsApiService.deletePlot(plot._id);
              if (response.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Plot Deleted',
                  text2: 'Plot has been deleted successfully',
                });
                
                // Refresh plots list
                await loadPlots();
                
                // Reset state if viewing deleted plot
                if (selectedPlot?._id === plot._id) {
                  setScreenState('list');
                  setSelectedPlot(null);
                }
              } else {
                throw new Error(response.error || 'Failed to delete plot');
              }
            } catch (err: any) {
              console.error('Error deleting plot:', err);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: err.response?.data?.error || 'Failed to delete plot. Please try again.',
              });
            }
          },
        },
      ]
    );
  };

  // Handle plot press
  const handlePlotPress = (plot: Plot) => {
    setSelectedPlot(plot);
    setScreenState('details');
  };

  // Handle edit plot
  const handleEditPlot = (plot: Plot) => {
    setSelectedPlot(plot);
    setScreenState('form');
  };

  // Handle add new plot
  const handleAddPlot = () => {
    setSelectedPlot(null);
    setScreenState('form');
  };

  // Handle back navigation
  const handleBack = () => {
    setScreenState('list');
    setSelectedPlot(null);
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
          <View className="bg-red-100 rounded-full p-6 mb-4">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">Error Loading Plots</Text>
          <Text className="text-gray-500 text-center mb-6">{error}</Text>
          <TouchableOpacity
            onPress={loadPlots}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show form screen
  if (screenState === 'form') {
    return (
      <PlotForm
        plot={selectedPlot}
        onSubmit={handleSubmitPlot}
        onCancel={handleBack}
        isLoading={isSubmitting}
      />
    );
  }

  // Show details screen
  if (screenState === 'details' && selectedPlot) {
    return (
      <PlotDetails
        plot={selectedPlot}
        onEdit={handleEditPlot}
        onDelete={handleDeletePlot}
        onClose={handleBack}
      />
    );
  }

  // Show list screen
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-800">Plots</Text>
            <Text className="text-gray-600 mt-1">
              {plots.length} {plots.length === 1 ? 'plot' : 'plots'} available
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAddPlot}
            className="bg-blue-600 p-3 rounded-xl"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {plots.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(200)}
            className="bg-white rounded-3xl p-10 items-center shadow-xl border border-gray-100"
          >
            <View className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-8 mb-6">
              <Ionicons name="business-outline" size={64} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-3">No Plots Yet</Text>
            <Text className="text-gray-500 text-center mb-8 text-lg leading-6">
              Start by adding your first plot to the system and showcase your properties
            </Text>
            <TouchableOpacity
              onPress={handleAddPlot}
              className="bg-blue-600 px-8 py-4 rounded-2xl shadow-lg"
            >
              <Text className="text-white font-bold text-lg">Add Your First Plot</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          <Animated.View entering={FadeInDown.duration(300)}>
            {plots.map((plot) => (
              <PlotCard
                key={plot._id}
                plot={plot}
                onPress={handlePlotPress}
                onEdit={handleEditPlot}
                onDelete={handleDeletePlot}
              />
            ))}
          </Animated.View>
        </ScrollView>
      )}

      {/* Toast Messages */}
      <Toast />
    </View>
  );
};

export default PlotsScreen;