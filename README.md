# 🏥 appPonluisa — Sistema de Historias Clínicas

Aplicación web/móvil construida con **Ionic + Angular** para la gestión de pacientes, historias clínicas y personal médico. Pensada como un sistema ligero de historias clínicas digitales con control de acceso por roles.

## ✨ Características

- 🔐 **Autenticación** con login y registro, y rutas protegidas mediante guard (`auth-guard`)
- 👥 **Roles de usuario**: `administrador` y `medico`, cada uno con su especialidad y registro médico
- 🧑‍🤝‍🧑 **Gestión de pacientes**: alta, edición, listado y ficha de detalle (nombre, edad, género, tipo de sangre, contacto, etc.)
- 📋 **Historias clínicas**: registro de consultas con diagnóstico, tratamiento y observaciones por paciente y médico
- 🩺 **Listado de médicos** para administración del personal
- 📱 Interfaz construida con **Ionic UI Components**, lista para ejecutarse en web, Android e iOS vía Capacitor

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| [Angular 20](https://angular.dev/) | Framework principal |
| [Ionic 8](https://ionicframework.com/) | Componentes UI y experiencia móvil |
| [Capacitor 7](https://capacitorjs.com/) | Empaquetado nativo (Android/iOS) |
| [RxJS](https://rxjs.dev/) | Manejo de estado reactivo |
| TypeScript | Lenguaje principal |

## 📂 Estructura del proyecto

```
src/app/
├── auth/               # Login y registro de usuarios
├── core/               # Modelos, servicios y guards compartidos
│   ├── models/         # User, Patient, MedicalHistory
│   ├── services/       # AuthService, PatientService, MedicalHistoryService, UserService
│   └── guards/         # auth-guard (rutas protegidas)
├── home/               # Dashboard principal
├── patient/            # CRUD de pacientes (lista, formulario, detalle)
├── medical-history/    # Historias clínicas (lista, formulario, vista por paciente)
└── users/              # Listado de médicos
```

## 🚀 Cómo correr el proyecto

### Requisitos previos
- [Node.js](https://nodejs.org/) (v18+)
- npm
- [Ionic CLI](https://ionicframework.com/docs/cli) (opcional, para comandos `ionic`)

### Instalación

```bash
npm install
```

### Servidor de desarrollo

```bash
npm start
# o
ng serve
```

La app quedará disponible en `http://localhost:4200/`.

### Build de producción

```bash
npm run build
```

### Tests

```bash
npm test
```

## 🔑 Credenciales de prueba

La app incluye usuarios de prueba precargados (almacenados en `localStorage`):

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@ponluisa.com` | `admin123` |
| Médico | `medico@ponluisa.com` | `medico123` |

## 📱 Build móvil (Capacitor)

```bash
ionic capacitor add android
ionic capacitor add ios
ionic capacitor sync
```

## 👤 Autor

Proyecto desarrollado por **Ponluisa** como parte del curso de Aplicaciones Web/Móviles.
