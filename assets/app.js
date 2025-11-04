// TaskGroup: i18n y tema común para todas las páginas
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const languageSelect = document.getElementById('language-select');

  // Usuario demo en localStorage
  const DEFAULT_USER = {
    name: 'María',
    email: 'maria@ejemplo.com',
    prefs: { timeFormat: '24h', emailNotifications: true }
  };
  const readUser = () => {
    try {
      const raw = localStorage.getItem('taskgroup-user');
      if (!raw) return { ...DEFAULT_USER };
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_USER, ...parsed, prefs: { ...DEFAULT_USER.prefs, ...(parsed.prefs || {}) } };
    } catch (_) { return { ...DEFAULT_USER }; }
  };
  const writeUser = (partial) => {
    const current = readUser();
    const merged = { ...current, ...partial };
    if (partial && partial.prefs) merged.prefs = { ...current.prefs, ...partial.prefs };
    try { localStorage.setItem('taskgroup-user', JSON.stringify(merged)); } catch (_) {}
    return merged;
  };
  const updateUserUI = () => {
    const u = readUser();
    document.querySelectorAll('[data-user-text="name"]').forEach(el => el.textContent = u.name || '');
    document.querySelectorAll('[data-user-avatar]').forEach(el => {
      const hasImg = !!u.avatarDataUrl;
      if (hasImg) {
        el.style.backgroundImage = 'url(' + u.avatarDataUrl + ')';
        el.classList.add('has-image');
        el.textContent = '';
      } else {
        el.style.backgroundImage = '';
        el.classList.remove('has-image');
        const ch = (u.name || u.email || 'U').trim().charAt(0).toUpperCase();
        el.textContent = ch;
      }
      el.setAttribute('title', u.name || u.email || '');
    });
    // Prefs inputs on profile page
    const nameI = document.getElementById('profile-name'); if (nameI) nameI.value = u.name || '';
    const emailI = document.getElementById('profile-email'); if (emailI) emailI.value = u.email || '';
    const tfVal = (u.prefs && u.prefs.timeFormat) || '24h';
    const tf = document.querySelector('input[name="timeformat"][value="' + tfVal + '"]'); if (tf) tf.checked = true;
    const en = document.getElementById('email-notifs'); if (en) en.checked = !!(u.prefs && u.prefs.emailNotifications);
    const prefLang = document.getElementById('pref-language'); if (prefLang) prefLang.value = root.lang || 'es';
    const prefTheme = document.getElementById('pref-theme'); if (prefTheme) prefTheme.value = (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  };

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
      footer: '© TaskGroup · Todos los derechos reservados',
      // User profile
      titleUser: 'TaskGroup · Perfil',
      userProfileTitle: 'Tu perfil',
      userProfileSubtitle: 'Gestiona los datos de tu perfil.',
      profileNameLabel: 'Nombre',
      profileNamePlaceholder: 'Tu nombre',
      profileEmailLabel: 'Email',
      profileEmailPlaceholder: 'tu@correo.com',
      profileLink: 'Perfil',
      userSaved: 'Perfil guardado',
      preferencesTitle: 'Preferencias',
      appearanceTitle: 'Apariencia',
      languageLabel: 'Idioma',
      themeLabel: 'Tema',
      themeLightOpt: 'Claro',
      themeDarkOpt: 'Oscuro',
      timeFormatLabel: 'Formato de hora',
      timeFormat12: '12 horas',
      timeFormat24: '24 horas',
      notificationsTitle: 'Notificaciones',
      emailNotificationsLabel: 'Recibir notificaciones por email',
      clearData: 'Borrar datos locales',
      clearDataDone: 'Datos locales borrados'
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
      footer: '© TaskGroup · All rights reserved',
      // User profile
      titleUser: 'TaskGroup · Profile',
      userProfileTitle: 'Your profile',
      userProfileSubtitle: 'Manage your profile details.',
      profileNameLabel: 'Name',
      profileNamePlaceholder: 'Your name',
      profileEmailLabel: 'Email',
      profileEmailPlaceholder: 'you@example.com',
      profileLink: 'Profile',
      userSaved: 'Profile saved',
      preferencesTitle: 'Preferences',
      appearanceTitle: 'Appearance',
      languageLabel: 'Language',
      themeLabel: 'Theme',
      themeLightOpt: 'Light',
      themeDarkOpt: 'Dark',
      timeFormatLabel: 'Time format',
      timeFormat12: '12-hour',
      timeFormat24: '24-hour',
      notificationsTitle: 'Notifications',
      emailNotificationsLabel: 'Receive email notifications',
      clearData: 'Clear local data',
      clearDataDone: 'Local data cleared'
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
      footer: '© TaskGroup · Todos os dereitos reservados',
      // User profile
      titleUser: 'TaskGroup · Perfil',
      userProfileTitle: 'O teu perfil',
      userProfileSubtitle: 'Xestiona os datos do teu perfil.',
      profileNameLabel: 'Nome',
      profileNamePlaceholder: 'O teu nome',
      profileEmailLabel: 'Correo',
      profileEmailPlaceholder: 'ti@correo.com',
      profileLink: 'Perfil',
      userSaved: 'Perfil gardado',
      preferencesTitle: 'Preferencias',
      appearanceTitle: 'Aparencia',
      languageLabel: 'Idioma',
      themeLabel: 'Tema',
      themeLightOpt: 'Claro',
      themeDarkOpt: 'Escuro',
      timeFormatLabel: 'Formato horario',
      timeFormat12: '12 horas',
      timeFormat24: '24 horas',
      notificationsTitle: 'Notificacións',
      emailNotificationsLabel: 'Recibir notificacións por correo',
      clearData: 'Borrar datos locais',
      clearDataDone: 'Datos locais borrados'
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
    updateUserUI();
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
  // Avatar file upload (user.html)
  const avatarFile = document.getElementById('avatar-file');
  if (avatarFile) {
    avatarFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { writeUser({ avatarDataUrl: reader.result }); updateUserUI(); };
      reader.readAsDataURL(file);
    });
  }
  const avatarRemove = document.getElementById('avatar-remove');
  if (avatarRemove) avatarRemove.addEventListener('click', () => { writeUser({ avatarDataUrl: null }); updateUserUI(); });

  // Guardar perfil (user.html)
  if (document.getElementById('profile-name') && document.getElementById('profile-email')) {
    const status = document.getElementById('profile-status');
    const form = document.querySelector('form#profile-form') || document.querySelector('.card form.stack-md');
    const onSave = (e) => {
      if (e) e.preventDefault();
      const name = (document.getElementById('profile-name')||{}).value || '';
      const email = (document.getElementById('profile-email')||{}).value || '';
      writeUser({ name, email });
      updateUserUI();
      const dict = getDictionary(currentLang);
      if (status) { status.textContent = dict.userSaved; status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); }
    };
    if (form) form.addEventListener('submit', onSave);
  }

  // Preferencias (user.html)
  const prefLang = document.getElementById('pref-language');
  if (prefLang) prefLang.addEventListener('change', (e) => applyLanguage(e.target.value));
  const prefTheme = document.getElementById('pref-theme');
  if (prefTheme) prefTheme.addEventListener('change', (e) => applyTheme(e.target.value));
  const tfRadios = document.querySelectorAll('input[name="timeformat"]');
  if (tfRadios.length) tfRadios.forEach(r => r.addEventListener('change', (e) => writeUser({ prefs: { timeFormat: e.target.value } })));
  const emailNotif = document.getElementById('email-notifs');
  if (emailNotif) emailNotif.addEventListener('change', (e) => writeUser({ prefs: { emailNotifications: !!e.target.checked } }));

  // Borrar datos locales (user.html)
  const clearBtn = document.getElementById('clear-data');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    try {
      localStorage.removeItem('taskgroup-user');
      localStorage.removeItem('taskgroup-language');
      localStorage.removeItem('taskgroup-theme');
      const dict = getDictionary(currentLang);
      const status = document.getElementById('profile-status');
      if (status) status.textContent = dict.clearDataDone;
      updateUserUI();
    } catch (_) {}
  });

  // Inicializa UI de usuario al cargar
  updateUserUI();
})();
 
