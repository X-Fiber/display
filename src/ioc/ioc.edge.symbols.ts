export const CoreSymbols = {
  // Services
  DiscoveryService: Symbol('DiscoveryService'),
  StorybookService: Symbol('StorybookService'),
  SchemeService: Symbol('SchemeService'),
  StoreService: Symbol('StoreService'),
  CombinationService: Symbol('CombinationService'),
  SessionService: Symbol('SessionService'),
  LocalizationService: Symbol('LocalizationService'),

  // Adapters
  HttpAdapter: Symbol('HttpAdapter'),
  WsAdapter: Symbol('WsAdapter'),

  // Loaders
  SchemaLoader: Symbol('SchemaLoader'),
  StorybookLoader: Symbol('StorybookLoader'),

  // Strategies
  LocalStorageStrategy: Symbol('LocalStorageStrategy'),
  SessionStorageStrategy: Symbol('SessionStorageStrategy'),

  // Factories
  StorageFactory: Symbol('StorageFactory'),

  // Providers
  StorageProvider: Symbol('StorageProvider'),
  NavigatorProvider: Symbol('NavigatorProvider'),
  AuthProvider: Symbol('AuthProvider'),


  // Agents
  FunctionalityAgent: Symbol('FunctionalityAgent'),
  SchemaAgent: Symbol('SchemaAgent'),
  StorybookAgent: Symbol('StorybookAgent'),

  // Initiator
  Initiator: Symbol('Initiator'),
} as const;
