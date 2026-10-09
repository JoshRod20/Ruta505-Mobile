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
7. [Despliegue del APK en Azure con Docker y Nginx](#despliegue-del-apk-en-azure-con-docker-y-nginx)
8. [Trazabilidad con GitHub main](#trazabilidad-del-despliegue-con-github-main)
9. [Comprobaciones, errores y tareas pendientes](#comprobaciones-errores-y-tareas-pendientes)

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
| **Azure VM + Docker + Nginx** | Hospedaje y descarga del APK Android; no aloja el backend Firebase ni sustituye Netlify |

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

## Despliegue del APK en Azure con Docker y Nginx

> **Alcance:** este despliegue distribuye `Ruta505.apk` mediante HTTP desde una máquina virtual Ubuntu de Microsoft Azure. **No** ejecuta una API REST propia ni el servidor Metro/Expo. Una vez instalado, el APK se comunica directamente con Firebase (Authentication, Firestore y Storage) y con los servicios externos configurados en la aplicación. La versión web continúa documentada como desplegada en Netlify.

### Infraestructura y artefacto publicado (9 de octubre de 2026)

| Elemento | Configuración observada |
|---|---|
| Plataforma | Máquina virtual Azure con Ubuntu, usuario SSH `deployuser`, hostname `desploy` |
| IP pública utilizada | `20.98.53.104` (podría cambiar si no está reservada) |
| Docker Engine | `29.1.3` |
| Docker Compose disponible | `docker-compose` V1 `1.29.2` (sintaxis con guion); `docker compose` V2 no estaba instalado |
| Imagen del servidor de descarga | `nginx:alpine` |
| Nombre del contenedor | `ruta505_web` |
| Directorio en VM | `/home/deployuser/ruta505-apk/` |
| Archivo servido | `/home/deployuser/ruta505-apk/public/Ruta505.apk` |
| Puerto | `8080` en Azure → `80` dentro del contenedor |
| URL de descarga HTTP | `http://20.98.53.104:8080/Ruta505.apk` |
| Tamaño informado por Nginx | `164288846` bytes (aprox. 157 MiB) |

**Evidencia ya obtenida:** `curl -I http://localhost:8080/Ruta505.apk` devolvió `HTTP/1.1 200 OK`, servidor `nginx/1.31.6`, `Content-Length: 164288846` y `Content-Type: application/octet-stream`. Esta prueba acredita que el servidor local entrega el archivo; **no acredita por sí sola** la disponibilidad externa, la instalación correcta en Android ni la existencia de HTTPS.

### Requisitos previos

- APK de Android compilado de Ruta505 (en el despliegue realizado: `C:\Ruta505.apk`).
- Clave privada SSH para la VM (en el despliegue realizado: `C:\mi-clave.pem`). **Nunca subir la clave privada a GitHub**.
- Acceso SSH al usuario `deployuser` en la IP de la VM.
- Docker Engine y `docker-compose` instalados en la VM.
- Regla de entrada TCP 8080 en el grupo de seguridad de red de Azure si se requiere acceso público. Comprobar también el firewall del sistema operativo si aplica.

### 1. Conectar desde PowerShell de Windows

```powershell
ssh -i "C:\mi-clave.pem" deployuser@20.98.53.104
```

**Importante:** los comandos que contienen rutas `C:\...` deben ejecutarse en **PowerShell de Windows**, no dentro de Ubuntu.

### 2. Crear los directorios en Ubuntu

```bash
mkdir -p ~/ruta505-apk/public
cd ~/ruta505-apk
```

Mantener este servicio separado de `~/backend-api/`: durante la configuración se identificó que en ese último directorio solo estaban `.env`, `Dockerfile` y `docker-compose.yml`, sin `package.json` ni `index.js`. Por ello, el contenedor Node.js inicialmente planteado no corresponde al despliegue real del APK.

### 3. Subir el APK desde PowerShell de Windows

Ejecutar en PowerShell (desde Windows, no en la sesión SSH):

```powershell
scp -i "C:\mi-clave.pem" "C:\Ruta505.apk" deployuser@20.98.53.104:/home/deployuser/ruta505-apk/public/Ruta505.apk
```

La transferencia efectuada reportó el `100%` del archivo, de aproximadamente `157 MB`. Para comprobarlo en Ubuntu:

```bash
ls -lh ~/ruta505-apk/public/Ruta505.apk
sha256sum ~/ruta505-apk/public/Ruta505.apk
```

El hash SHA-256 se debe conservar para vincular el APK publicado con el artefacto de compilación; **no se registró todavía un hash comprobado** en este documento.

### 4. Crear la configuración Docker Compose

Archivo: `~/ruta505-apk/docker-compose.yml`.

```yaml
version: "3.8"
services:
  web:
    image: nginx:alpine
    container_name: ruta505_web
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./public:/usr/share/nginx/html:ro
```

La carpeta `public/` se monta en modo **solo lectura** dentro de Nginx. De esta manera, el contenedor expone archivos estáticos sin necesidad de una aplicación Express o API Node.js.

> **GitHub:** es recomendable versionar esta configuración en el repositorio como `deploy/azure/docker-compose.yml`, pero no afirmar que ya está allí hasta agregarla y hacer `push` a `main`. Si se copia a `deploy/azure/`, mantener la ruta de `public/` coherente o ejecutar Compose desde el directorio de despliegue correcto.

### 5. Levantar y verificar Nginx

En la VM:

```bash
cd ~/ruta505-apk
sudo docker-compose config -q
sudo docker-compose up -d
sudo docker ps
curl -I http://localhost:8080/Ruta505.apk
sudo docker logs --tail 30 ruta505_web
```

Se espera `HTTP/1.1 200 OK` al consultar el archivo existente. `docker-compose config -q` terminó sin errores durante la validación realizada.

Si `docker-compose up -d` informa `Conflict. The container name "/ruta505_web" is already in use`, revisar primero el contenedor existente en lugar de eliminarlo:

```bash
sudo docker ps -a
sudo docker inspect -f '{{.Name}} {{.State.Status}} {{.Config.Image}}' ruta505_web
```

Si está detenido y corresponde a este mismo servicio:

```bash
sudo docker start ruta505_web
```

Si está activo y el `curl -I` devuelve `200`, no es necesario crear otro contenedor. **No ejecutar `docker-compose` desde `~` si el archivo válido está en `~/ruta505-apk`**.

### 6. Descargar desde el celular

Dirección HTTP utilizada durante las pruebas:

```text
http://20.98.53.104:8080/Ruta505.apk
```

Para probar desde fuera de la VM, ejecutar en otro equipo:

```powershell
curl.exe -I http://20.98.53.104:8080/Ruta505.apk
```

Si funciona localmente pero no desde internet, revisar la regla de entrada TCP 8080 en Azure y el firewall del servidor. Para la landing page, usar un enlace directo al recurso, preferiblemente **HTTPS**; una página HTTPS puede bloquear la descarga de un APK desde una dirección HTTP (contenido mixto). No se ha demostrado todavía que el botón de descarga de la landing page funcione en Android.

## Trazabilidad del despliegue con GitHub main

**Requisito de evaluación:** demostrar que el código que genera el APK alojado en Azure corresponde exactamente a una revisión identificable de la rama principal (`main`) del repositorio GitHub. La mera existencia del archivo APK en Azure **no prueba** esa correspondencia: el artefacto se subió manualmente mediante `scp`.

### Procedimiento reproducible para acreditar el origen del APK

1. En el repositorio local de Ruta505, comprobar que el árbol de trabajo está limpio y que se compila desde `main`:

   ```bash
   git fetch origin
   git switch main
   git pull --ff-only origin main
   git status --short
   git rev-parse HEAD
   ```

   `git status --short` debe estar vacío. Guardar el hash de commit mostrado por `git rev-parse HEAD`.

2. Compilar el **APK instalable** desde ese commit siguiendo el proceso de Android/EAS definido por el equipo. Con EAS Build, el perfil debe generar `buildType: apk` (no AAB) para descarga directa. Si se usa otra herramienta, registrar el comando, el perfil, la versión de la app y la identificación del build. **El build de `C:\Ruta505.apk` ya subido no tiene aquí un commit de origen verificado**.

3. Calcular el SHA-256 del APK **local**:

   ```powershell
   Get-FileHash "C:\Ruta505.apk" -Algorithm SHA256
   ```

4. Calcular el SHA-256 del APK **publicado** en Azure:

   ```bash
   sha256sum ~/ruta505-apk/public/Ruta505.apk
   ```

   Los hashes deben coincidir. Esta comparación prueba que se subió el mismo archivo, pero para probar la procedencia también se requiere evidencia de que ese APK fue compilado desde el commit registrado.

5. Mantener en GitHub (`main`) el README actualizado, la configuración Docker Compose del despliegue y, cuando corresponda, los scripts de compilación/publicación. **No subir** la clave `.pem`, `.env`, tokens privados ni credenciales. No es necesario subir el APK al repositorio de código fuente.

6. Registrar por cada versión: `commit de main`, fecha, herramienta/perfil de build, versión del APK, SHA-256 local, SHA-256 en Azure, URL publicada y resultado de la prueba de descarga. Una canalización CI/CD que compile desde `main` y publique el artefacto automáticamente sería una mejora posterior; **no estaba configurada en la evidencia disponible**.

### Plantilla de registro de publicación

| Campo | Valor a completar |
|---|---|
| Commit de GitHub `main` | Pendiente de registrar |
| Build de Android / perfil | Pendiente de registrar |
| Fecha del despliegue inicial | 2026-10-09 |
| Archivo | `Ruta505.apk` |
| SHA-256 local | Pendiente de registrar |
| SHA-256 en Azure | Pendiente de registrar |
| Comprobación local Nginx | `HTTP/1.1 200 OK` |
| Comprobación externa de descarga | Pendiente de verificar |

## Comprobaciones, errores y tareas pendientes

### Comandos para las evidencias de Azure

```bash
hostname
whoami
docker --version
sudo systemctl status docker --no-pager
sudo docker ps
cd ~/ruta505-apk
cat docker-compose.yml
sudo docker-compose config -q
ls -lh public/Ruta505.apk
curl -I http://localhost:8080/Ruta505.apk
sudo docker logs --tail 15 ruta505_web
```

| Criterio | Evidencia lograda | Pendiente |
|---|---|---|
| Rendimiento y acceso | APK presente; Nginx respondió con HTTP 200 en localhost | Probar desde internet, disponibilidad sostenida y tiempos de respuesta |
| HTTPS | Se comprobó que el enlace actual usa HTTP | Configurar dominio/certificado TLS válido, servir HTTPS y redirigir HTTP |
| Flujo automático | Contenedor configurado con reinicio `unless-stopped` y archivo servido | Verificar instalación sin soporte y configurar páginas de error 404/50X amigables |
| Integraciones | El proyecto usa Firebase Auth/Firestore/Storage y API de Claude según la arquitectura | Probar funcionalmente las integraciones, permisos, reglas de Firestore/Storage y manejo de fallos |
| GitHub `main` | Proyecto versionado en GitHub según la documentación | Registrar commit real del build, cotejar hashes y versionar la configuración de Azure |

### Seguridad y secretos

- **No publicar archivos `.pem`, claves privadas de servicio ni `.env` en GitHub.** Mantener un `.env.example` sin valores reales.
- Las variables `EXPO_PUBLIC_*` se incluyen en el cliente Expo: **no son un almacenamiento seguro de secretos**. En particular, **no publicar una clave secreta de Anthropic/Claude como `EXPO_PUBLIC_ANTHROPIC_API_KEY`**. Para protegerla es necesario mover las llamadas autenticadas a un servicio del lado del servidor (por ejemplo, una Cloud Function) y almacenar allí el secreto.
- La configuración de Firebase para aplicaciones cliente no reemplaza las **reglas de seguridad** de Firestore y Storage ni las comprobaciones de usuario autenticado.
- El URL actual es HTTP. Para distribución pública se debe habilitar HTTPS con certificado válido y actualizar el botón de la landing page para apuntar a la URL HTTPS final.
- Evitar publicar evidencias con variables sensibles, claves o tokens de acceso visibles.

### Comportamiento esperado y solución de problemas

| Síntoma | Comprobación / solución |
|---|---|
| `docker compose` no existe | En este servidor estaba instalado Compose V1; usar `sudo docker-compose ...`. Planificar migración a Compose V2. |
| `docker-compose config -q` sin salida | Configuración Compose válida. |
| Error por nombre `ruta505_web` en uso | Consultar `sudo docker ps -a`; reutilizar contenedor existente si es el correcto. |
| `curl -I localhost:8080/Ruta505.apk` devuelve 200 | Nginx entrega el APK localmente. |
| La URL pública no abre | Verificar NSG de Azure, firewall de Ubuntu, IP y puerto publicado. |
| Descarga falla desde landing HTTPS | Utilizar un destino HTTPS válido; evitar descargar un APK por HTTP desde una página segura. |
| APK descargado no representa `main` | Recompilar desde un commit registrado y comparar hashes local/Azure. |

---

**Equipo:** Cuajada Salvaje · Hackathon Nicaragua 2026 · hN10
