export const es = {
  // Auth
  login: "Iniciar Sesión",
  logout: "Cerrar Sesión",
  username: "Nombre de Usuario",
  password: "Contraseña",
  invalidCredentials: "Credenciales inválidas",
  
  // Navigation
  dashboard: "Panel de Control",
  servers: "Servidores",
  settings: "Configuración",
  home: "Inicio",
  
  // Server Management
  createServer: "Crear Servidor",
  serverName: "Nombre del Servidor",
  serverType: "Tipo de Servidor",
  version: "Versión",
  memory: "Memoria",
  port: "Puerto",
  difficulty: "Dificultad",
  gameMode: "Modo de Juego",
  maxPlayers: "Jugadores Máximos",
  serverId: "ID del Servidor",
  
  // Server Actions
  start: "Iniciar",
  stop: "Detener",
  restart: "Reiniciar",
  delete: "Eliminar",
  edit: "Editar",
  console: "Consola",
  files: "Archivos",
  
  // Status
  online: "En Línea",
  offline: "Desconectado",
  starting: "Iniciando",
  stopping: "Deteniendo",
  running: "Ejecutándose",
  stopped: "Detenido",
  not_found: "No Encontrado",
  
  // Common
  save: "Guardar",
  cancel: "Cancelar",
  confirm: "Confirmar",
  loading: "Cargando...",
  error: "Error",
  success: "Éxito",
  
  // Messages
  serverCreated: "Servidor creado exitosamente",
  serverDeleted: "Servidor eliminado exitosamente",
  serverStarted: "Servidor iniciado exitosamente",
  serverStopped: "Servidor detenido exitosamente",
  loginSuccess: "Inicio de sesión exitoso",
  
  // Errors
  serverNotFound: "Servidor no encontrado",
  connectionError: "Error de conexión",
  unexpectedError: "Error inesperado",
  
  // Language
  language: "Idioma",
  spanish: "Español",
  english: "Inglés",
  
  // Welcome page
  welcome: "Bienvenido",
  welcomeDescription: "Gestiona tus servidores de Minecraft con facilidad",
  enterCredentials: "Ingresa tus credenciales para continuar",
  enterServer: "ENTRAR AL SERVIDOR",
  allRightsReserved: "Todos los derechos reservados",
  help: "Ayuda",
  privacy: "Privacidad",
  terms: "Términos",
  
  // Dashboard
  myServers: "Mis Servidores",
  noServers: "No tienes servidores creados",
  noServersDesc: "Crea tu primer servidor para comenzar",
  createFirstServer: "Crear Mi Primer Servidor",
  manageServer: "Gestionar Servidor",
  deleteServerConfirm: "¿Estás seguro de que quieres eliminar este servidor?",
  deleteServerDesc: "Esta acción no se puede deshacer. Se eliminará permanentemente el servidor y todos sus datos.",
  
  // Form validation
  idMinLength: "El ID debe tener al menos 3 caracteres",
  idMaxLength: "El ID debe tener máximo 20 caracteres",
  idInvalidChars: "El ID solo puede contener letras, números, guiones y guiones bajos",
  
  // Server creation
  serverCreationDesc: "Crea un nuevo servidor de Minecraft",
  serverIdPlaceholder: "mi-servidor",
  serverIdDesc: "Identificador único para tu servidor"
};

export type TranslationKey = keyof typeof es;
