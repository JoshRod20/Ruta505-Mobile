# Ruta 505

Descubre la Cultura junto a Pinolito

Aplicación móvil y web que conecta a turistas con comunidades, artesanos y guías locales, ofreciendo recomendaciones culturales personalizadas a través de Pinolito, un asistente conversacional impulsado por la API de Claude.

Desarrollado por el equipo Cuajada Salvaje para Hackathon Nicaragua 2026.

---

## Tabla de contenido

1. [Arquitectura]
2. [Dependencias]
3. [Variables de entorno]
4. [Estructura modular]
5. [Scripts]
6. [Ejemplos de endpoints]

---

## Arquitectura

**Nombre de la arquitectura:** Arquitectura en capas con organización por características (*Layered + Feature-based Architecture*).

- **Por capas:** separa responsabilidades técnicas en carpetas independientes (`components`, `services`, `context`, `hooks`, `utils`).
- **Por características:** agrupa las pantallas en `screens/` según el rol de usuario (turista, comunidad, artesano, guía, INTUR) en lugar de mezclarlas todas juntas.

Este enfoque híbrido combina la claridad de una capa técnica (saber dónde vive la lógica de un tipo) con la facilidad de encontrar todo lo relacionado a una vista concreta.

Ruta 505 no tiene un backend propio: usa **Firebase** como backend-as-a-service (autenticación, base de datos y almacenamiento) y consume la **API de Claude** para dar vida a Pinolito, el asistente virtual. El proyecto está construido con **React Native + Expo**, lo que permite compilar el mismo código a apps nativas (Android/iOS) y a una versión web, desplegada en **Netlify**. El repositorio se versiona en **GitHub**.

### Arquitectura de alto nivel

```
┌───────────────────────────────────────────────────────┐
│                  Ruta 505 (Expo)                       │
│      React Native · JavaScript · Expo Router           │
│                                                         │
│  ┌───────────────┐          ┌──────────────────┐       │
│  │  Vistas por    │          │   Interfaz de    │       │
│  │  rol (screens/)│          │   Pinolito       │       │
│  └───────────────┘          └──────────────────┘       │
└───────────┬───────────────────────┬────────────────────┘
            │                       │
   ┌────────▼────────┐     ┌────────▼─────────┐
   │    Firebase      │     │   API Claude     │
   │ (Auth/Firestore/ │     │   (Anthropic)    │
   │   Storage)        │     │                  │
   └───────────────────┘     └──────────────────┘
            │
   ┌────────▼─────────────┬──────────────────────┐
   │  Expo (build móvil)  │  Netlify (build web)  │
   │  Android / iOS       │  Web                  │
   └───────────────────────┴──────────────────────┘
```

| Servicio | Función |
|---|---|
| **Firebase** | Autenticación, base de datos en tiempo real (Firestore) y almacenamiento |
| **API de Claude** | Motor de inteligencia artificial detrás de Pinolito, el asistente conversacional |
| **Netlify** | Hosting y despliegue continuo de la versión web |
| **GitHub** | Repositorio y control de versiones del proyecto |

## Dependencias

```json
{
  "dependencies": {
    "@maplibre/maplibre-react-native": "^11.3.6",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/geolocation": "^3.4.0",
    "@react-navigation/bottom-tabs": "^7.18.14",
    "@react-navigation/drawer": "^7.13.8",
    "@react-navigation/native": "^7.3.14",
    "@react-navigation/native-stack": "^7.18.6",
    "expo": "~54.0.35",
    "expo-dev-client": "~6.0.21",
    "expo-image-manipulator": "~14.0.8",
    "expo-image-picker": "~17.0.11",
    "expo-linear-gradient": "~15.0.8",
    "expo-location": "~19.0.8",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "firebase": "^12.17.1",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-keyboard-aware-scroll-view": "^0.9.5",
    "react-native-qrcode-svg": "^6.3.21",
    "react-native-reanimated": "~4.1.1",
    "react-native-responsive-screen": "^1.4.2",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-vector-icons": "^10.3.0",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^10.6.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "vite": "^8.1.1"
  }
}
```

| Dependencia | Uso en Ruta 505 |
|---|---|
| `expo` | Toolchain para compilar la app a Android, iOS y web desde un solo código base |
| `react` / `react-native` | Base de la interfaz de usuario |
| `react-native-web` | Permite que los componentes de React Native se rendericen en el navegador |
| `@react-navigation/*` | Navegación entre pantallas (stack, tabs) en móvil y web |
| `firebase` | Autenticación, Firestore y almacenamiento |
| `@anthropic-ai/sdk` | Comunicación con la API de Claude para Pinolito |
| `eslint` | Linter del código fuente |

## Variables de entorno

Todas las llaves sensibles viven en `.env` (no se sube a Git). Expo expone al cliente solo las variables con prefijo `EXPO_PUBLIC_`.

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# API de Claude (Pinolito)
EXPO_PUBLIC_ANTHROPIC_API_KEY=
EXPO_PUBLIC_ANTHROPIC_MODEL=claude-sonnet-4-6
```

## Estructura modular

```
ruta505/
├── assets/                    # imágenes, ilustraciones, fuentes, ícono de la app
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── components/            # componentes reutilizables de UI
│   │   ├── common/            # botones, cards, inputs, modales genéricos
│   │   ├── layout/             # header, tab bar, drawer
│   │   └── pinolito/           # chat, burbujas de mensaje, avatar del mascota
│   │
│   ├── screens/                # una carpeta por vista/rol (nivel de pantalla)
│   │   ├── turista/
│   │   ├── comunidad/
│   │   ├── artesano/
│   │   ├── guia/
│   │   └── intur/
│   │
│   ├── navigation/
│   │   └── AppNavigator.js    # define la navegación (stack, tabs) para móvil y web
│   │
│   ├── services/               # conexión con servicios externos
│   │   ├── firebase.js         # inicialización de Firebase (auth, firestore)
│   │   ├── claudeApi.js        # llamadas a la API de Claude (Pinolito)
│   │   └── experiencias.js     # funciones CRUD de experiencias/reservas
│   │
│   ├── context/                # estado global (React Context)
│   │   ├── AuthContext.js
│   │   └── UserContext.js
│   │
│   ├── hooks/                  # hooks personalizados
│   │   ├── useAuth.js
│   │   └── usePinolito.js
│   │
│   └── utils/                  # funciones auxiliares (formatos, validaciones)
│
├── .env                              # llaves de Firebase y Claude (no subir a Git)
├── .env.example                      # Plantilla de llaves de Firebase y Claude (no subir a Git)
├── .gitignore
├── app.json                     # configuración de Expo (nombre, ícono, splash, permisos)
├── App.js                       # punto de entrada de la aplicación
├── babel.config.js
├── package.json
├── netlify.toml                 # configuración de build/despliegue web en Netlify
└── README.md
```

**Justificación de la organización:**

- `screens/`: agrupa las vistas por rol de usuario, así cualquiera del equipo ubica la vista que busca sin pensarlo.
- `components/pinolito/`: aísla todo lo relacionado al asistente de IA, separado del resto de la interfaz.
- `services/`: es la única capa que habla con Firebase y con la API de Claude; si cambia una llave o un endpoint, se modifica un solo archivo.
- `context/` y `hooks/`: mantienen el estado de sesión y de Pinolito accesible desde cualquier componente sin pasar props en cascada.
- `app.json` / `netlify.toml`: configuración específica de cada plataforma de despliegue (Expo para móvil, Netlify para web), separada del resto del código.

## Scripts

| Comando | Descripción |
|---|---|
| `npx expo start` | Levanta el servidor de desarrollo de Expo (móvil, con QR para Expo Go) |
| `npx expo start --web` | Levanta el servidor de desarrollo en modo web |
| `npx expo export --platform web` | Genera el build de producción de la versión web en `/dist` (para Netlify) |
| `eas build --platform android` | Genera el build de producción para Android vía EAS Build |
| `eas build --platform ios` | Genera el build de producción para iOS vía EAS Build |
| `npm run lint` | Corre ESLint sobre el código fuente |

## Modo Development Build con Expo

- `Proyecto` Ruta505-Mobile 
- `Directorio` C:\Users\rodri\OneDrive\Documentos\repos\Ruta505-Mobile
- `Dispositivo probado` SM-S928B
- `Modo` Development Build con Expo

## Configuración Android detectada
- `compileSdk:` 36
-	`targetSdk:` 36
-	`minSdk:` 24
-	`buildTools:` 36.0.0
-	`NDK:` 27.1.12297006
-	`Kotlin:` 2.1.20

# Preparación antes de iniciar

1. Conecta el teléfono por USB.
2. Activa Opciones de desarrollador.
3. Activa Depuración USB.
4. Acepta la autorización de depuración USB si aparece.
5. Comprueba que ADB reconoce el dispositivo.

```bash
adb devices
```

Debe aparecer un dispositivo con estado `device`. El identificador puede cambiar.

# Inicio normal del proyecto

Este es el flujo que debes usar normalmente después de cerrar el proyecto o reiniciar Windows.

6. Abre Git Bash, PowerShell o CMD.
7. Entra al directorio del proyecto:

```bash
cd "C:\Users\rodri\OneDrive\Documentos\repos\Ruta505-Mobile"
```

8. Inicia Metro con el development client:

```bash
npx expo start --dev-client
```

Metro quedará disponible normalmente en el puerto 8081. Abre la aplicación de desarrollo en el teléfono.

# Cuándo usar npx expo run:android --device

```bash
npx expo run:android --device
```

Este comando recompila e instala la aplicación Android. Úsalo cuando:

- Es la primera ejecución en el dispositivo.
- El development build no está instalado.
- Instalaste una librería con código nativo.
- Cambiaste configuración nativa de Android.
- Cambiaste dependencias que afectan la parte nativa.
- Necesitas actualizar el APK después de una modificación nativa.

## No es necesario para

- Cambios en JSX/JS.
- Cambios de estilos.
- Cambios de textos.
- Cambios de navegación JavaScript.
- Cambios de lógica de interfaz.
- Cambios normales de contenido servido por Metro.

# Flujo diario recomendado

```bash
cd "C:\Users\rodri\OneDrive\Documentos\repos\Ruta505-Mobile"

npx expo start --dev-client
```

Con Metro ejecutándose, puedes usar:

- `r` → recargar la aplicación.
- `j` → abrir debugger.
- `m` → menú de desarrollo.
- `a` → abrir Android.
- `w` → abrir web.

# Si Metro necesita limpiarse

Si la aplicación no refleja cambios o Metro queda en un estado extraño:

```bash
npx expo start --dev-client -c
```

La opción `-c` limpia la caché de Metro. No es necesario usarla en cada inicio.

# Si instalas una nueva dependencia

Si la dependencia es puramente JavaScript, normalmente basta con reiniciar Metro. Si contiene código nativo, recompila:

```bash
npx expo run:android --device
```

**Importante:** No ejecutes `npx expo prebuild --clean` automáticamente. Solo debe hacerse cuando existe una razón concreta para regenerar la configuración nativa.

# El SDK Android 36

Anteriormente se comprobó que no existía android.jar dentro de la plataforma android-36. Sin embargo, la compilación actual terminó correctamente con `BUILD SUCCESSFUL`.

**Regla:** Si Gradle compila correctamente, no vuelvas a modificar manualmente el SDK solo por un problema que ya no existe.

# Advertencias de la compilación

La compilación mostró warnings relacionados con SDK XML, APIs deprecadas, Android edge-to-edge, manifests y varias dependencias. Son advertencias, no errores de compilación.

```text
BUILD SUCCESSFUL
```

Mientras la compilación termine así, deben tratarse por separado de un fallo real.

# platform-tools.backup

Android detectó una segunda carpeta:

```text
C:\Users\rodri\AppData\Local\Android\Sdk\platform-tools.backup
```

La carpeta principal `platform-tools` fue utilizada correctamente. No fue la causa del fallo de instalación.

**Recomendación:** No borres carpetas del SDK manualmente mientras el proyecto funcione.

# Error INSTALL_FAILED_UPDATE_INCOMPATIBLE

```text
INSTALL_FAILED_UPDATE_INCOMPATIBLE: Existing package com.kennrod20.Ruta505 signatures do not match newer version
```

Este error significa que el teléfono tenía una versión anterior de Ruta505 firmada con una clave diferente. Android no permite reemplazarla directamente con otra firma.

Si vuelve a aparecer:

```bash
adb uninstall com.kennrod20.Ruta505
```

```bash
npx expo run:android --device
```

**Advertencia:** Desinstalar la aplicación elimina sus datos locales, incluido lo almacenado por AsyncStorage.

# Si el teléfono no aparece

```bash
adb devices
```

Si aparece como `unauthorized`, acepta la autorización en el teléfono.

Si no aparece, reinicia ADB:

```bash
adb kill-server

adb start-server

adb devices
```

# Si la app no conecta con Metro

- Comprueba que Metro esté ejecutándose.
- Comprueba `adb devices`.
- Verifica que el teléfono esté conectado y autorizado.
- Reinicia Metro con caché limpia si es necesario.

```bash
npx expo start --dev-client -c
```

# Si reinicias la computadora

No necesitas reinstalar Android SDK, Build-Tools ni dependencias.

```bash
cd "C:\Users\rodri\OneDrive\Documentos\repos\Ruta505-Mobile"

npx expo start --dev-client
```

Si el APK de desarrollo sigue instalado, no necesitas recompilar solo porque Windows se haya reiniciado.

# Comandos de referencia

| Comando | Uso |
|---|---|
| `cd "C:\Users\rodri\OneDrive\Documentos\repos\Ruta505-Mobile"` | Entrar al proyecto |
| `npx expo start --dev-client` | Iniciar Metro |
| `npx expo start --dev-client -c` | Iniciar Metro limpiando caché |
| `npx expo run:android --device` | Compilar e instalar Android |
| `adb devices` | Ver dispositivos |
| `adb kill-server` | Detener ADB |
| `adb start-server` | Iniciar ADB |
| `adb uninstall com.kennrod20.Ruta505` | Desinstalar Ruta505 |

# Qué NO hacer sin una razón concreta

- No borrar `node_modules` porque sí.
- No borrar `package-lock.json` porque sí.
- No eliminar `android` porque sí.
- No ejecutar `prebuild --clean` como solución universal.
- No reinstalar el SDK si Gradle ya compila.
- No modificar firmas o manifests sin identificar el problema.
- No borrar carpetas del SDK por un warning.

En proyectos React Native/Expo es muy fácil convertir un problema pequeño en una tarde completa de reconstrucción. Primero se identifica el fallo, luego se modifica solo lo necesario.

# Flujo rápido para memorizar

En la mayoría de las sesiones:

```bash
cd "C:\Users\rodri\OneDrive\Documentos\repos\Ruta505-Mobile"

npx expo start --dev-client
```

Si necesitas recompilar Android:

```bash
npx expo run:android --device
```

Si Metro presenta problemas:

```bash
npx expo start --dev-client -c
```

Si el teléfono no aparece:

```bash
adb devices
```

# Regla principal

**Código JavaScript/JSX/estilos → Metro.**

**Código nativo/dependencias nativas → recompilación Android.**

La instalación actual está lista para continuar el desarrollo de Ruta505 Mobile. El objetivo es evitar compilaciones y reinstalaciones innecesarias, manteniendo estable el entorno que ya funciona.


## Ejemplos de endpoints

Ruta 505 **no expone un backend REST propio**: `services/` es la capa que centraliza toda comunicación externa. Estas funciones actúan como los "endpoints" internos de la aplicación.

### `services/firebase.js` — Autenticación y datos

```js
import { signUp, signIn, logOut } from "./services/firebase";

// Registrar un nuevo usuario (turista, comunidad, artesano, guía o INTUR)
await signUp({ email, password, role: "turista" });

// Iniciar sesión
const user = await signIn({ email, password });

// Cerrar sesión
await logOut();
```

### `services/experiencias.js` — CRUD de experiencias y reservas

```js
import { getExperiencias, createReserva } from "./services/experiencias";

// Obtener experiencias culturales disponibles, filtradas por comunidad
const experiencias = await getExperiencias({ comunidad: "Masaya" });

// Crear una reserva para una experiencia
await createReserva({
  experienciaId: "exp_0032",
  turistaId: user.uid,
  fecha: "2026-08-15",
  personas: 2,
});
```

### `services/claudeApi.js` — Pinolito (IA conversacional)

```js
import { sendMessageToPinolito } from "./services/claudeApi";

const respuesta = await sendMessageToPinolito({
  mensaje: "¿Qué experiencias culturales hay cerca de Masaya?",
  historial: chatHistory,
});

console.log(respuesta.texto);
// → "Cerca de Masaya puedes visitar el mercado artesanal y..."
```

---

**Equipo:** Cuajada Salvaje · Hackathon Nicaragua 2026 · hN10