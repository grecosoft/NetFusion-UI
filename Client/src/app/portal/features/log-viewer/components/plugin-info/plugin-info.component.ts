import {Component, Input} from '@angular/core';
import {CompositePlugin, PluginModule} from '../../types/log-types';

@Component({
  selector: 'plugin-info',
  templateUrl: './plugin-info.component.html',
  styleUrls: ['./plugin-info.component.scss']
})
export class PluginInfoComponent {

  @Input('plugin')
  public plugin: CompositePlugin;

  public serviceColumns = ['serviceType', 'implementationType', 'lifeTime'];

  public selectedPluginModule: PluginModule;

}
