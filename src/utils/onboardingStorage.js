// src/utils/onboardingStorage.js

import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY =
  "@ruta505_onboarding_completed";

// ==================================================
// COMPROBAR SI YA COMPLETÓ EL ONBOARDING
// ==================================================

export const hasCompletedOnboarding = async () => {
  try {
    const value =
      await AsyncStorage.getItem(
        ONBOARDING_KEY
      );

    console.log(
      "Estado onboarding:",
      value
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

// ==================================================
// MARCAR ONBOARDING COMO COMPLETADO
// ==================================================

export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem(
      ONBOARDING_KEY,
      "true"
    );

    console.log(
      "Onboarding guardado en AsyncStorage"
    );

    // Verificación inmediata
    const value =
      await AsyncStorage.getItem(
        ONBOARDING_KEY
      );

    console.log(
      "Valor guardado:",
      value
    );
  } catch (error) {
    console.error(
      "Error guardando onboarding:",
      error
    );

    throw error;
  }
};

// ==================================================
// REINICIAR ONBOARDING
// ==================================================

export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem(
      ONBOARDING_KEY
    );

    console.log(
      "Onboarding reiniciado"
    );
  } catch (error) {
    console.error(
      "Error reiniciando onboarding:",
      error
    );

    throw error;
  }
};