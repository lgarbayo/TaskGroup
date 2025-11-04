// TaskGroup: i18n y tema común para todas las páginas
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const languageSelect = document.getElementById('language-select');

  const translations = {
    es: {
      pageTitle: 'TaskGroup · Acceder',
      titleLogin: 'TaskGroup · Acceder',
      titleProjects: 'TaskGroup · Mis proyectos',
      titleProject: 'TaskGroup · Proyecto',
      titleProjectSummary: 'TaskGroup · Resumen',
      titleProjectMembers: 'TaskGroup · Miembros',
      titleProjectNew: 'TaskGroup · Nuevo proyecto',
      titleTaskNew: 'TaskGroup · Nueva tarea',
      titleTaskEdit: 'TaskGroup · Editar tarea',
      titleRegister: 'TaskGroup · Registro',
      // Common UI
      projectsTitle: 'Mis proyectos',
      projectsSubtitle: 'Listado de proyectos donde participas.',
      newProject: 'Nuevo proyecto',
      logout: 'Salir',
      open: 'Abrir',
      delete: 'Eliminar',
      tabTasks: 'Tareas',
      tabSummary: 'Resumen',
      tabMembers: 'Miembros',
      newTask: 'Nueva tarea',
      addMember: 'Añadir miembro',
      deleteProject: 'Eliminar proyecto',
      projectSummaryTitle: 'Resumen del proyecto',
      viewTasks: 'Ver tareas',
      totalTasks: 'Tareas totales',
      pending: 'Pendientes',
      resolved: 'Resueltas',
      progress: 'Progreso',
      projectMembersTitle: 'Miembros del proyecto',
      addUserTitle: 'Añadir un usuario',
      addUserSubtitle: 'Indica el email del usuario que quieres añadir.',
      addUserEmailLabel: 'Email del usuario',
      userEmailPlaceholder: 'usuario@correo.com',
      add: 'Añadir',
      back: 'Volver',
      membersTitle: 'Miembros',
      owner: 'Propietaria',
      remove: 'Quitar',
      taskNewTitle: 'Crear nueva tarea',
      taskNewSubtitle: 'Define los detalles de la tarea.',
      assigneeLabel: 'Usuario asignado',
      taskNameLabel: 'Nombre de la tarea',
      taskNamePlaceholder: 'Diseñar estructura de datos',
      statusLabel: 'Estado',
      createTask: 'Crear tarea',
      cancel: 'Cancelar',
      editTaskTitle: 'Editar tarea',
      editTaskSubtitle: 'Actualiza el nombre, estado o asignación.',
      saveChanges: 'Guardar cambios',
      deleteTask: 'Eliminar tarea',
      showPassword: 'Mostrar contraseña',
      hidePassword: 'Ocultar contraseña',
      languageSelectLabel: 'Seleccionar idioma',
      themeDark: 'Modo oscuro',
      themeLight: 'Modo claro',
      registerCta: 'Crear cuenta',
      loginTitle: 'Accede a tu espacio',
      loginSubtitle: 'Planifica tareas y colabora con tu equipo.',
      emailLabel: 'Email o alias',
      emailPlaceholder: 'tu@correo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: '••••••••',
      signIn: 'Entrar',
      note: '¿Aún no tienes cuenta? Crea una en menos de un minuto.',
      footer: '© TaskGroup · Todos los derechos reservados'
    },
    en: {
      pageTitle: 'TaskGroup · Sign in',
      titleLogin: 'TaskGroup · Sign in',
      titleProjects: 'TaskGroup · My projects',
      titleProject: 'TaskGroup · Project',
      titleProjectSummary: 'TaskGroup · Summary',
      titleProjectMembers: 'TaskGroup · Members',
      titleProjectNew: 'TaskGroup · New project',
      titleTaskNew: 'TaskGroup · New task',
      titleTaskEdit: 'TaskGroup · Edit task',
      titleRegister: 'TaskGroup · Sign up',
      // Common UI
      projectsTitle: 'My projects',
      projectsSubtitle: 'List of projects you participate in.',
      newProject: 'New project',
      logout: 'Sign out',
      open: 'Open',
      delete: 'Delete',
      tabTasks: 'Tasks',
      tabSummary: 'Summary',
      tabMembers: 'Members',
      newTask: 'New task',
      addMember: 'Add member',
      deleteProject: 'Delete project',
      projectSummaryTitle: 'Project summary',
      viewTasks: 'View tasks',
      totalTasks: 'Total tasks',
      pending: 'Pending',
      resolved: 'Resolved',
      progress: 'Progress',
      projectMembersTitle: 'Project members',
      addUserTitle: 'Add a user',
      addUserSubtitle: 'Enter the email of the user you want to add.',
      addUserEmailLabel: 'User email',
      userEmailPlaceholder: 'user@example.com',
      add: 'Add',
      back: 'Back',
      membersTitle: 'Members',
      owner: 'Owner',
      remove: 'Remove',
      taskNewTitle: 'Create new task',
      taskNewSubtitle: 'Define the task details.',
      assigneeLabel: 'Assignee',
      taskNameLabel: 'Task name',
      taskNamePlaceholder: 'Design data structure',
      statusLabel: 'Status',
      createTask: 'Create task',
      cancel: 'Cancel',
      editTaskTitle: 'Edit task',
      editTaskSubtitle: 'Update name, status or assignee.',
      saveChanges: 'Save changes',
      deleteTask: 'Delete task',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      languageSelectLabel: 'Select language',
      themeDark: 'Dark mode',
      themeLight: 'Light mode',
      registerCta: 'Create account',
      loginTitle: 'Access your workspace',
      loginSubtitle: 'Plan tasks and collaborate with your team.',
      emailLabel: 'Email or alias',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      signIn: 'Sign in',
      note: 'No account yet? Create one in under a minute.',
      footer: '© TaskGroup · All rights reserved'
    },
    gl: {
      pageTitle: 'TaskGroup · Acceder',
      titleLogin: 'TaskGroup · Acceder',
      titleProjects: 'TaskGroup · Os meus proxectos',
      titleProject: 'TaskGroup · Proxecto',
      titleProjectSummary: 'TaskGroup · Resumo',
      titleProjectMembers: 'TaskGroup · Membros',
      titleProjectNew: 'TaskGroup · Novo proxecto',
      titleTaskNew: 'TaskGroup · Nova tarefa',
      titleTaskEdit: 'TaskGroup · Editar tarefa',
      titleRegister: 'TaskGroup · Rexistro',
      // Common UI
      projectsTitle: 'Os meus proxectos',
      projectsSubtitle: 'Listado de proxectos nos que participas.',
      newProject: 'Novo proxecto',
      logout: 'Saír',
      open: 'Abrir',
      delete: 'Eliminar',
      tabTasks: 'Tarefas',
      tabSummary: 'Resumo',
      tabMembers: 'Membros',
      newTask: 'Nova tarefa',
      addMember: 'Engadir membro',
      deleteProject: 'Eliminar proxecto',
      projectSummaryTitle: 'Resumo do proxecto',
      viewTasks: 'Ver tarefas',
      totalTasks: 'Tarefas totais',
      pending: 'Pendentes',
      resolved: 'Resoltas',
      progress: 'Progreso',
      projectMembersTitle: 'Membros do proxecto',
      addUserTitle: 'Engadir un usuario',
      addUserSubtitle: 'Indica o correo do usuario que queres engadir.',
      addUserEmailLabel: 'Correo do usuario',
      userEmailPlaceholder: 'usuario@correo.com',
      add: 'Engadir',
      back: 'Volver',
      membersTitle: 'Membros',
      owner: 'Propietaria',
      remove: 'Quitar',
      taskNewTitle: 'Crear nova tarefa',
      taskNewSubtitle: 'Define os detalles da tarefa.',
      assigneeLabel: 'Usuario asignado',
      taskNameLabel: 'Nome da tarefa',
      taskNamePlaceholder: 'Deseñar estrutura de datos',
      statusLabel: 'Estado',
      createTask: 'Crear tarefa',
      cancel: 'Cancelar',
      editTaskTitle: 'Editar tarefa',
      editTaskSubtitle: 'Actualiza o nome, estado ou asignación.',
      saveChanges: 'Gardar cambios',
      deleteTask: 'Eliminar tarefa',
      showPassword: 'Mostrar contrasinal',
      hidePassword: 'Agochar contrasinal',
      languageSelectLabel: 'Selecciona idioma',
      themeDark: 'Modo escuro',
      themeLight: 'Modo claro',
      registerCta: 'Crear conta',
      loginTitle: 'Accede ao teu espazo',
      loginSubtitle: 'Planifica tarefas e colabora co teu equipo.',
      emailLabel: 'Correo ou alcume',
      emailPlaceholder: 'ti@correo.com',
      passwordLabel: 'Contrasinal',
      passwordPlaceholder: '••••••••',
      signIn: 'Entrar',
      note: 'Aínda non tes conta? Créaa en menos dun minuto.',
      footer: '© TaskGroup · Todos os dereitos reservados'
    }
  };

  const getDictionary = (lang) => translations[lang] || translations.es;
  let currentLang = root.lang || 'es';

  const updatePasswordToggleLabels = () => {
    document.querySelectorAll('[data-toggle="password"]').forEach((btn) => {
      const targetSel = btn.getAttribute('data-target');
      const input = targetSel ? document.querySelector(targetSel) : null;
      if (!input) return;
      const dict = getDictionary(currentLang);
      const isText = input.type === 'text';
      const label = isText ? dict.hidePassword : dict.showPassword;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  };

  const updateThemeToggleLabel = () => {
    if (!toggle) return;
    const dict = getDictionary(currentLang);
    const isDark = root.getAttribute('data-theme') === 'dark';
    const label = isDark ? dict.themeLight : dict.themeDark;
    toggle.textContent = label;
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  };

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggle) toggle.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      if (toggle) toggle.setAttribute('aria-pressed', 'false');
    }
    updateThemeToggleLabel();
    try { localStorage.setItem('taskgroup-theme', theme); } catch (_) {}
  };

  const applyLanguage = (lang) => {
    currentLang = lang;
    const dict = getDictionary(lang);
    root.lang = lang;

    if (languageSelect) {
      languageSelect.value = lang;
      languageSelect.setAttribute('aria-label', dict.languageSelectLabel);
      languageSelect.setAttribute('title', dict.languageSelectLabel);
    }

    // Título del documento vía meta[name="doc-title"] si existe clave
    const titleMeta = document.querySelector('meta[name="doc-title"]');
    if (titleMeta && dict[titleMeta.content]) {
      document.title = dict[titleMeta.content];
    }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    updateThemeToggleLabel();
    updatePasswordToggleLabels();
    try { localStorage.setItem('taskgroup-language', lang); } catch (_) {}
  };

  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let storedTheme = null, storedLanguage = null;
  try {
    storedTheme = localStorage.getItem('taskgroup-theme');
    storedLanguage = localStorage.getItem('taskgroup-language');
  } catch (_) {}

  const initialLanguage = storedLanguage || root.lang || 'es';
  applyLanguage(initialLanguage);

  if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
      applyLanguage(event.target.value);
    });
  }

  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // Toggle de contraseña: botones con data-toggle="password"
  document.querySelectorAll('[data-toggle="password"]').forEach((btn) => {
    const targetSel = btn.getAttribute('data-target');
    const input = targetSel ? document.querySelector(targetSel) : null;
    const updateAria = updatePasswordToggleLabels;
    if (!input) return;
    btn.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      updatePasswordToggleLabels();
    });
    // inicializar label
    updatePasswordToggleLabels();
  });
})();
 
