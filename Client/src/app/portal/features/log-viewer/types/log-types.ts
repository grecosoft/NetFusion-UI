export class CompositeLog {
  HostPlugin: CompositePlugin;
  ApplicationPlugins: {[id: string]: CompositePlugin};
  CorePlugins: {[id: string]: CompositePlugin};
}

export class CompositePlugin {
  PluginName: string;
  PluginId: string;
  PluginAssembly: string;
  PluginDescription: string;
  PluginSourceUrl: string;
  PluginDocUrl: string;
  ServiceRegistrations: ServiceRegistration[];
  PluginModules: {[name: string]: any};
  ModuleDetails: PluginModule[] = [];
}

export class PluginModule {
  ModuleName: string;
  FullModuleName: string;
  Details: any;
}

export class ServiceRegistration {
  serviceType: string;
  implementationType: string;
  lifeTime: string;
}
