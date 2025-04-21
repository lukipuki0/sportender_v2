# Presentado por:
- Lucas Erazo
- José Lara
- Pablo Silva
- José Villamayor
# Sportender - app de encuentros deportivos

##  Índice
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Requerimientos](#requerimientos)
3. [Arquitectura de la Información](#arquitectura-de-la-información)
3. [Diseño de prototipos](#prototipo-de-diseño)
4. [Librerías en Angular](#liberías-usadas-con-angular)

## Resumen del Proyecto
  Creacion de una app donde se puedan encontrar casualmente actividades deportivas, ej. partidos de futbol, voleibol, padel, etc, (similar a la idea de tinder, pero version deportivo).
  
---
## Requerimientos

## Roles del Sistema
- **Usuario**: Quien utiliza la app para buscar, crear, ingresar, etc. a eventos deportivos.

## Requerimientos Funcionales por Rol

### Rol-Usuario

  ## Requerimientos Funcionales
  
  - **RF1  Búsqueda de Eventos:**
    El usuario podrá  buscar eventos activos filtrando por ubicación actual (usando GPS) y un radio de búsqueda configurable (ej. 1km, 5km, 10km).
  
  - **RF2  Creación de Evento :**
    El usuario podrá crear un nuevo evento, especificando: tipo de actividad, ubicación, fecha/hora de inicio (que no puede ser más allá de 12 horas desde el momento de la creación), número máximo de participantes, y una breve descripción.
    
  - **RF3 Unirse a un Evento:**
    El usuario podrá solicitar unirse a un evento existente. El sistema debe validar que el evento no esté lleno y que cumpla cualquier otro criterio (si lo hubiera).
    
  - **RF4 Participación en Chat de Evento:**
    Una vez que un Usuario se une a un evento, el sistema debe darle acceso automáticamente a un chat grupal específico para ese evento, donde pueden comunicarse todos los participantes confirmados y el creador.
    
  - **RF5 Ver historial**
    El usuario podrá ver una lista de los eventos a los que se ha unido o que ha creado, separando los próximos de los pasados (historial).
    
  - **RF6  Mostrar perfil**
    El usuario podrá ver su perfil
    
  - **RF7  Editar perfil**
    El usuario podrá editar los datos de su perfil.


## Requerimientos No Funcionales

- **RNF1 (Rendimiento):**
  La búsqueda de eventos por proximidad debe devolver resultados en menos de 3 segundos bajo condiciones de red normales.
  
- **RNF3 (Confiabilidad):**
  La funcionalidad de geolocalización (GPS) debe tener una precisión de al menos 50 metros en áreas urbanas. La aplicación debe tener una disponibilidad del 99%.
  
- **RNF8 (Integridad de Datos):**
  El sistema debe asegurar que el estado de los eventos (ej. cupos disponibles), los mensajes de chat y las calificaciones de usuario se actualicen de forma consistente y no se pierdan datos en caso de fallos menores o latencias.
  
---
## Arquitectura de la Información 

Estructura de navegacion de la app Sportender -> [Estructura de Navegación](https://lucid.app/lucidchart/5008d571-666a-45e5-95bd-7b9cf3a08ced/edit?viewport_loc=-121%2C-666%2C2992%2C1401%2C0_0&invitationId=inv_a50a9807-806f-4a4e-aceb-a0c5dc4ed0c6)

---

## Prototipo de diseño 
Prototipo de la app sportender -> [Prototipo Figma](https://www.figma.com/design/rgKF6bER848KhmkPPDWvob/SPORTENDER?node-id=0-1&t=MGmwIi1nXBRG8aPb-1)
Contraseña: 1qaz2wsx

---
## Liberías usadas con Angular
- Leaflet
- date-nfs

## Tecnologías
- **Ionic Framework** (v7.2.1)
- **Angular** (v19+)
- **TypeScript**
- **Capacitor** (para plugins nativos, si aplica)
- **SASS** (para estilos)
- **RxJS** (para manejo reactivo)
- **Angular Router** (para navegación entre vistas)
