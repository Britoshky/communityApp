import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    defineCustomElements(window); // Define los elementos personalizados PWA
    if (!this.databaseService.isInitialized()) {
      await this.databaseService.initializePlugin();
    }
    try {
      const initialized = await this.databaseService.initializePlugin();
      if (!initialized) {
        console.error('SQLite Plugin initialization failed.');
      } else {
      }
    } catch (error) {
      console.error('Error initializing SQLite Plugin:', error);
    }
  }
}
