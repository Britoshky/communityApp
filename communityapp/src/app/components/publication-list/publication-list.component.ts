import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service'; // Importa el servicio de SQLite
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DeleteConfirmationComponent,
  ],
})
export class PublicationListComponent implements OnInit {
  publications: any[] = [];
  displayedPublications: any[] = [];
  initialized = false;
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10; // Valor predeterminado para el selector
  Math = Math; // Hacer `Math` accesible en la plantilla

  constructor(
    private modalController: ModalController,
    private router: Router,
    private databaseService: DatabaseService, // Inyecta el servicio
    private toastController: ToastController // Inyecta el controlador de Toast
  ) {}

  async ngOnInit() {
    try {
      this.initialized = await this.databaseService.initializePlugin();
      if (this.initialized) {
        await this.loadPublications();
      } else {
        console.error('Failed to initialize SQLite database.');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async ionViewWillEnter() {
    if (this.initialized) {
      await this.loadPublications();
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
// Obtiene todas las publicaciones y actualiza la vista
  async loadPublications() {
    this.isLoading = true;
    try {
      this.publications = await this.databaseService.getAllPublications();
      this.updateDisplayedPublications();
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      this.isLoading = false;
    }
  }

  updateDisplayedPublications() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPublications = this.publications.slice(startIndex, endIndex);
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event.detail.value;
    this.currentPage = 1; // Reinicia a la primera página
    this.updateDisplayedPublications();
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.publications.length / this.itemsPerPage)) {
      this.currentPage++;
      this.updateDisplayedPublications();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPublications();
    }
  }

  async presentDeleteModal(publication: any) {
    const modal = await this.modalController.create({
      component: DeleteConfirmationComponent,
      componentProps: { publicationTitle: publication.title },
    });

    modal.onDidDismiss().then(async (event) => {
      if (event.data?.confirmed) {
        await this.deletePublication(publication.id); // Usa el ID de la publicación
      }
    });

    await modal.present();
  }

  async deletePublication(id: number) {
    try {
      await this.databaseService.deletePublication(id); // Usa el servicio para eliminar
      await this.loadPublications(); // Recarga las publicaciones
      this.presentToast('Publicación eliminada correctamente.'); // Muestra el mensaje de éxito
    } catch (error) {
      console.error('Error deleting publication:', error);
      this.presentToast('Error al eliminar la publicación.', 'danger'); // Muestra un mensaje de error
    }
  }

  // Muestra un mensaje Toast
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
