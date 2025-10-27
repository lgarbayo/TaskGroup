# TaskGroup

---

## 🧩 Descripción general del sistema **TaskGroup**

Se trata de desarrollar una aplicación web denominada **TaskGroup** que implementa un sistema de **gestión colaborativa de tareas en proyectos compartidos**.  
La idea es facilitar que, por ejemplo, un grupo de personas que trabaja de forma conjunta en una actividad (como un proyecto académico) pueda **crear un espacio común donde planificar tareas, asignarlas entre los miembros y controlar su progreso de forma clara y accesible**.

Una aplicación conocida similar sería Trello, pero **TaskGroup está diseñada para ofrecer una solución más simple, ligera y centrada en la colaboración entre personas**, sin necesidad de una estructura empresarial ni de funcionalidades avanzadas.

La aplicación permitirá **registrar usuarios**, y cada usuario podrá **crear un nuevo proyecto** (como por ejemplo *“Proyecto de TSWI”*) al que podrá **invitar a otros usuarios**.  
Dentro de cada proyecto, cualquier miembro podrá **crear tareas**, asignarlas a otros usuarios (o a sí mismo), **marcarlas como resueltas**, y consultar un **resumen general** con el progreso del equipo.

---

### 📋 Funcionalidades principales

🟢 **(F1) Registrarse:** indicando un alias (sin espacios), una contraseña y un email.  
🟢 **(F2) Autenticarse:** comprobando las credenciales. Una vez autenticado, irá al listado de proyectos (ver 🔴 F3).  
🔴 **(F3) Listar proyectos:** se verá un listado de todos los proyectos donde el usuario está incluido. Una vez se hace clic en un proyecto, se irá a 🔴 F5.  
🔴 **(F4) Crear proyecto nuevo:** indicando un nombre del proyecto.  
🔴 **(F5) Ver proyecto:** en este panel se verá un listado de las tareas agrupadas en pendientes y resueltas. Además, desde este panel se podrá:  
  • 🔴 **(F6)** Añadir un usuario al proyecto (indicando el email del usuario que se quiere añadir).  
  • 🔴 **(F7)** Crear tarea nueva, indicando:  
   – Usuario asignado (por defecto, el usuario autenticado).  
   – Nombre de la tarea.  
   – Estado: puede ser *resuelta* o *pendiente*, por defecto *pendiente* (el cambio de estado se hará en 🔴 F8).  
🔴 **(F8) Editar una tarea existente:** pudiendo cambiar cualquier campo (nombre, estado, usuario asignado).  
🔴 **(F9) Eliminar una tarea.**  
🔴 **(F10) Ver resumen del proyecto:** esta parte mostrará:  
  (i) Número de tareas totales.  
  (ii) Número de tareas pendientes.  
  (iii) Número de tareas resueltas.  
  (iv) Progreso global del proyecto (calculado como % de tareas resueltas).  
🔴 **(F11) Eliminar proyecto.**

---

✅ **Funciones en verde (🟢)** → públicas: pueden hacerse sin login.  
🔒 **Funciones en rojo (🔴)** → requieren autenticación previa.

---
