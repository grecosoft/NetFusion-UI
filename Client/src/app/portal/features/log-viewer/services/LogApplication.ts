import {CompositeLog, CompositePlugin} from '../types/log-types';
import {LogService} from './LogService';
import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {ApiConnection} from '../../../../types/connection-types';
import {ConnectionService} from '../../../../services/ConnectionService';

@Injectable()
export class LogApplication {

  public selectedConnection: ApiConnection;
  public currentLog: CompositeLog;

  public hostPlugin: CompositePlugin;
  public applicationPlugins: CompositePlugin[];
  public corePlugins: CompositePlugin[];

  constructor(
    private logService: LogService,
    private connectionService: ConnectionService) {

    this.subscriptions();
  }

  public loadCompositeLog(connection: ApiConnection) {
    this.logService.readCompositeLog(connection);
  }

  private subscriptions() {

    this.logService.whenLogReceived.subscribe(log => {
      this.setPluginTypes(log);

      this.currentLog = log;
    });
  }

  // The currently configured connections.
  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
  }

  private setPluginTypes(compositeLog: CompositeLog) {
    this.hostPlugin = compositeLog.HostPlugin;

    this.applicationPlugins = _.map(compositeLog.ApplicationPlugins, (p: CompositePlugin, id: string) => {
          this.setPluginModules(p);
          return p;
       });

    this.corePlugins = _.map(compositeLog.CorePlugins, (p: CompositePlugin, id: string) => {
      this.setPluginModules(p);
      return p;
    });
  }

  private setPluginModules(plugin: CompositePlugin) {
    plugin.ModuleDetails = [];

    _.forOwn(plugin.PluginModules, (detailVal, detailProp) => {
      plugin.ModuleDetails.push(
        {
          FullModuleName: detailProp,
          ModuleName: this.getModuleShortName(detailProp),
          Details: detailVal });
    });
  }

  private getModuleShortName(fullName: string): string {
    const parts = fullName.split('.');

    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
    return null;

  }
}
