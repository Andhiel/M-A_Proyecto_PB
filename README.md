# MeetingVoice 🎤

Aplicación web de transcripción inteligente de reuniones con animaciones 3D y extracción automática de tareas.

## 🚀 Características

- **Transcripción en Tiempo Real**: Graba audio y transcribe automáticamente usando Web Speech API
- **Extracción de Tareas**: Detecta automáticamente planes de acción, responsables y fechas límite
- **Dashboard Interactivo**: Visualiza tareas pendientes, completadas y observaciones
- **Animaciones 3D**: Landing page y loader con efectos de partículas (galaxia/cometa)
- **Sistema de Login**: Autenticación con dos usuarios predefinidos
- **Diseño Responsive**: Funciona en desktop y móvil
- **Almacenamiento Local**: Persistencia de datos usando localStorage

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Andhiel/M-A_Proyecto_PB.git
cd M-A_Proyecto_PB
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 👥 Usuarios de Acceso

La aplicación tiene dos usuarios predefinidos:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| user | user123 | Usuario |

Puedes usar los botones de "Acceso rápido" en la pantalla de login para autocompletar las credenciales.

## 📖 Cómo Usar

### 1. Landing Page
- Verás una página con animaciones 3D de un micrófono flotante
- Haz clic en "Comenzar Gratis" para ir al login

### 2. Login
- Ingresa las credenciales de admin o user
- O usa los botones de acceso rápido
- Haz clic en "Iniciar Sesión"

### 3. Grabar Reunión
- Haz clic en "Iniciar Reunión"
- Concede permisos de micrófono cuando se soliciten
- Habla normalmente para ver la transcripción en tiempo real
- Haz clic en "Finalizar Reunión" cuando termines

### 4. Revisar Tareas Extraídas
- El sistema mostrará las tareas detectadas automáticamente
- Edita la descripción, responsable, fecha límite y proyecto
- Elimina tareas que no correspondan
- Haz clic en "Confirmar y Guardar"

### 5. Dashboard
- Ve a la sección "Dashboard" para ver todas tus tareas
- Filtra por: Todas, Pendientes, Completadas, Observaciones
- Marca tareas como completadas con el checkbox
- Elimina tareas con el botón de basura
- Revisa las observaciones de proyectos

### 6. Cerrar Sesión
- Haz clic en el botón "Salir" en la navegación superior
- Volverás a la landing page

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Estilos**: TailwindCSS
- **3D Animations**: Three.js, React Three Fiber, React Three Drei
- **Iconos**: Lucide React
- **Fechas**: date-fns
- **Transcripción**: Web Speech API (navegador)

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── LandingPage.tsx       # Landing page con animaciones 3D
│   ├── Login.tsx             # Sistema de login
│   ├── LoadingScreen.tsx     # Pantalla de carga con loader 3D
│   ├── MicrophoneLoader.tsx  # Loader con partículas galaxia/cometa
│   ├── MeetingRecorder.tsx   # Grabación y transcripción
│   └── Dashboard.tsx         # Dashboard de tareas
├── utils/
│   └── cn.ts                 # Utilidad para clases CSS
├── App.tsx                   # Componente principal
├── main.tsx                  # Punto de entrada
└── index.css                 # Estilos globales
```

## ⚠️ Notas Importantes

- **Compatibilidad de Navegador**: La transcripción por voz funciona mejor en Chrome y Edge. Firefox tiene soporte limitado.
- **Permisos de Micrófono**: Debes conceder permisos de micrófono para usar la función de grabación.
- **Almacenamiento**: Los datos se guardan en localStorage del navegador. Si borras la caché, perderás los datos.
- **Extracción de Tareas**: Usa reglas básicas para MVP. Para producción, se recomienda integrar una API de LLM.

## 🚀 Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza la build de producción
npm run lint     # Ejecuta el linter
```

## 📝 Licencia

Este proyecto es parte del curso de Metodologías Ágiles - EPN.

## 👨‍💻 Desarrolladores

- Andhiel

---

**¡Disfruta transcribiendo tus reuniones de forma inteligente!** 🎙️✨
