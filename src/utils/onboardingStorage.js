/**
 * onboardingStorage: componente/pantalla de la aplicación Ruta505.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/** Clave de AsyncStorage para el estado de onboarding. */
const ONBOARDING_KEY = "@ruta505_onboarding_completed";

/**
 * Comprueba si el usuario ya completó el onboarding.
 * @returns {Promise<boolean>} true si el onboarding fue completado.
 */
export const hasCompletedOnboarding = async () => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error comprobando onboarding:", error);
    return false;
  }
};

/**
 * Marca el onboarding como completado en AsyncStorage.
 * @throws {Error} Si falla la escritura.
 */
export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch (error) {
    console.error("Error guardando onboarding:", error);
    throw error;
  }
};

/**
 * Elimina el estado de onboarding (útil para pruebas o reinicio).
 * @throws {Error} Si falla la eliminación.
 */
export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error("Error reiniciando onboarding:", error);
    throw error;
  }
};
