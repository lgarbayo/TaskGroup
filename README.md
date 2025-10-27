# TaskGroup

---

## 🧩 Descripción general del sistema **TaskGroup**

Se trata de desarrollar una aplicación web denominada **TaskGroup** que implementa un sistema de **gestión colaborativa de tareas en proyectos compartidos**.  
La idea es facilitar que, por ejemplo, un grupo de personas que trabaja de forma conjunta en una actividad (como un proyecto académico) pueda **crear un espacio común donde planificar tareas, asignarlas entre los miembros y controlar su progreso de forma clara y accesible**.

Una aplicación conocida similar sería Trello, pero **TaskGroup está diseñada para ofrecer una solución más simple, ligera y centrada en la colaboración entre personas**,  
sin necesidad de una estructura empresarial ni de funcionalidades avanzadas.

La aplicación permitirá **registrar usuarios**, y cada usuario podrá **crear un nuevo proyecto** (como por ejemplo *“Proyecto de TSWI”*) al que podrá **invitar a otros usuarios**.  
Dentro de cada proyecto, cualquier miembro podrá **crear tareas**, asignarlas a otros usuarios (o a sí mismo), **marcarlas como resueltas**, y consultar un **resumen general** con el progreso del equipo.

---

### 📋 Funcionalidades principales

<span style="color:limegreen">**(F1) Registrarse**</span>: indicando un alias (sin espacios), una contraseña y un email.  
<span style="color:limegreen">**(F2) Autenticarse**</span>: comprobando las credenciales. Una vez autenticado, irá al listado de proyectos (ver <span style="color:red">F3</span>).  
<span style="color:red">**(F3) Listar proyectos**</span>: se verá un listado de todos los proyectos donde el usuario está incluido. Una vez se hace clic en un proyecto, se irá a <span style="color:red">F5</span>.  
<span style="color:red">**(F4) Crear proyecto nuevo**</span>: indicando un nombre del proyecto.  
<span style="color:red">**(F5) Ver proyecto**</span>: en este panel se verá un listado de las tareas agrupadas en pendientes y resueltas. Además, desde este panel se podrá:  
  • <span style="color:red">**(F6)**</span> Añadir un usuario al proyecto (indicando el email del usuario que se quiere añadir).  
  • <span style="color:red">**(F7)**</span> Crear tarea nueva, indicando:  
   – Usuario asignado (por defecto, el usuario autenticado).  
   – Nombre de la tarea.  
   – Estado: puede ser *resuelta* o *pendiente*, por defecto *pendiente* (el cambio de estado se hará en <span style="color:red">F8</span>).  
<span style="color:red">**(F8) Editar una tarea existente**</span>: pudiendo cambiar cualquier campo (nombre, estado, usuario asignado).  
<span style="color:red">**(F9) Eliminar una tarea**</span>.  
<span style="color:red">**(F10) Ver resumen del proyecto**</span>: esta parte mostrará:  
  (i) Número de tareas totales.  
  (ii) Número de tareas pendientes.  
  (iii) Número de tareas resueltas.  
  (iv) Progreso global del proyecto (calculado como % de tareas resueltas).  
<span style="color:red">**(F11) Eliminar proyecto**</span>.

---

✅ **Funciones en verde** → públicas: pueden hacerse sin login.  
🔒 **Funciones en rojo** → requieren autenticación previa.

---
