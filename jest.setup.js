// Mocks globales: ningún test debe tocar Firebase, GPS, cámara ni módulos nativos.
jest.mock("./src/services/firebase", () => ({
  auth: { currentUser: null },
  db: {},
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock").default
);

// SVG: se reemplaza por Views vacías (solo se usa para la curva decorativa).
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = ({ children }) => React.createElement(View, null, children);
  return { __esModule: true, default: Mock, Svg: Mock, Path: Mock, Circle: Mock, Rect: Mock, G: Mock };
});

// Íconos: no renderizan nada (evita cargar fuentes).
// Íconos: no renderizan nada (evita cargar fuentes).
jest.mock(
  "@expo/vector-icons",
  () => {
    const Icon = () => null;
    return { Ionicons: Icon, MaterialIcons: Icon, MaterialCommunityIcons: Icon, FontAwesome: Icon, Feather: Icon };
  },
  { virtual: true }

);
