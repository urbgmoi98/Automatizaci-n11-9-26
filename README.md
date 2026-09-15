# 🤖 Priorizador Inteligente de Tareas (React + Matrix Mode)

> ⚡ *Mi primer proyecto de automatización real en React. ¡Ordena tareas solo, detecta emergencias y tiene fondo estilo Matrix!* 🟢

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

¡Hola! 👋 Soy estudiante/dev junior y este es mi proyecto final para aprender **automatizaciones en React**.  
La idea era simple: *"¿Y si mis tareas se ordenaran solas según la fecha límite?"*... pero terminé agregando un **modo pánico**, persistencia local y un fondo de código binario cayendo porque... ¿por qué no? 😅

---

## 📸 Vista Previa

| Modo Normal 🟢 | Modo Pánico 🚨 |
|:---:|:---:|
| ![Normal](https://via.placeholder.com/400x250/0f172a/00ff00?text=Priorizador+Activo) | ![Panic](https://via.placeholder.com/400x250/0f172a/ff4444?text=PROTOCOL_PANIC) |

*(Nota: Las imágenes son placeholders. ¡Corre el proyecto para ver la magia real!)*

---

## ✨ ¿Qué hace esta app?

- 🔄 **Automatización Real**: Cada 8 segundos (o al hacer clic), reordena todas las tareas por fecha límite.
- 🚨 **Modo Pánico Inteligente**: Si detecta +3 tareas vencidas, se detiene y te sugiere reprogramarlas automáticamente.
- 💾 **Persistencia Local**: Usa `localStorage` como base de datos. ¡Tus cambios sobreviven al recargar!
- 🟢 **Fondo Matrix Binario**: Canvas animado con ceros y unos cayendo. Optimizado para no quemar tu CPU.
- 🎨 **UI Cyberpunk**: Glassmorphism, neón, terminal style y animaciones suaves con Framer Motion.
- 🧹 **Código Limpio**: Hooks personalizados, limpieza de efectos (`clearInterval`), `useCallback` y componentización.

---

## 🛠️ Tecnologías Usadas

| Categoría | Herramientas |
|-----------|-------------|
| **Core** | React 18, Vite, JavaScript ES6+ |
| **Estilos** | Tailwind CSS, Framer Motion |
| **Iconos** | Lucide React |
| **Lógica** | Custom Hooks, localStorage API, Canvas API |
| **Extras** | Mucha café ☕ y documentación de React |

---

## 🚀 Cómo Correrlo (¡Es súper fácil!)

### Requisitos previos
- Node.js 16+ 
- npm o yarn

### Pasos
1. **Clona el repo** (o descarga los archivos)
   ```bash
   git clone https://github.com/tu-usuario/priorizador-inteligente.git
   cd priorizador-inteligente