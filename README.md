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
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "react-native-web": "~0.19.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "firebase": "^10.13.0",
    "@anthropic-ai/sdk": "^0.27.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "eslint": "^9.9.0"
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
├── .env                         # llaves de Firebase y Claude (no subir a Git)
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