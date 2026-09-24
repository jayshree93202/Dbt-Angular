import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideHttpClient ,  withFetch} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHighcharts } from 'highcharts-angular';

import { routes } from './app.routes';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),

    provideHighcharts({
      instance: () => import('highcharts/esm/highcharts').then(m => m.default),

      modules: () => [
        import('highcharts/esm/modules/exporting'),
        import('highcharts/esm/modules/export-data'),
        import('highcharts/esm/modules/offline-exporting')
      ]
    })
  ]
};
