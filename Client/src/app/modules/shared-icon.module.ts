import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
    imports: [HttpClientModule]
})
export class SharedIconModule {

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer) {

            this.registerIcons([
              'add_box',
              'apps',
              'check_box',
              'check_circle',
              'description',
              'developer_board',
              'edit',
              'delete_forever',
              'find_in_page',
              'language',
              'account_tree',
              'question_answer',
              'settings',
              'remove_circle',
              'menu_open',
              'code',
              'close',
              'error_outline',
              'settings_ethernet',
              'build',
              'clear_all',
              'sent',
              'list',
              'view_compact',
              'message',
              'layers',
              'play_for_work',
              'network_check'
            ]);
    }

    registerIcons(icons: string[]) {

        for (const icon of icons) {
            this.iconRegistry.addSvgIcon(
                icon,
                this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`));
        }
    }
}
