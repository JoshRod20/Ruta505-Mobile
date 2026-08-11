// src/utils/onboardingStorage.js

import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY =
  "@ruta505_onboarding_completed";

// COMPROBAR SI YA COMPLETÓ EL ONBOARDING
export const hasCompletedOnboarding = async () => {
  try {
    const value =
      await AsyncStorage.getItem(
        ONBOARDING_KEY
      );

    return value === "true";
  } catch (error) {
    console.error(
      "Error comprobando onboarding:",
      error
    );

    return false;
  }
};

// MARCAR ONBOARDING COMO COMPLETADO
export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem(
      ONBOARDING_KEY,
      "true"
    );
  } catch (error) {
    console.error(
      "Error guardando onboarding:",
      error
    );

    throw error;
  }
};

// REINICIAR ONBOARDING
// Útil durante desarrollo/pruebas
export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem(
      ONBOARDING_KEY
    );
  } catch (error) {
    console.error(
      "Error reiniciando onboarding:",
      error
    );
  }
};