import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service'; // Importa el servicio de base de datos

@Component({
  selector: 'app-publication-form',
  templateUrl: './publication-form.component.html',
  styleUrls: ['./publication-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class PublicationFormComponent {
  publicationForm: FormGroup;
  image: string = '';

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private toastController: ToastController // Inyecta ToastController
  ) {
    this.publicationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
      });
      this.image = image.dataUrl!;
    } catch (error: any) {
      if (error.message.includes('User cancelled photos app')) {
        this.showToast('Operación de cámara cancelada.', 'warning');
      } else {
        this.showToast('Error al tomar la foto.', 'danger');
        console.error('Error al tomar la foto:', error);
      }
    }
  }

  async savePublication() {
    if (!this.databaseService.isInitialized()) {
      this.showToast('Conexión a la base de datos no inicializada.', 'danger');
      return;
    }

    if (this.publicationForm.invalid) {
      this.showToast('Formulario inválido. Corrige los errores.', 'warning');
      return;
    }

    const publication = {
      title: this.publicationForm.value.title,
      description: this.publicationForm.value.description,
      image: this.image,
      date: new Date().toISOString(),
    };

    try {
      await this.databaseService.addPublication(publication);
      this.publicationForm.reset();
      this.image = '';
      this.showToast('Publicación guardada exitosamente.', 'success');
    } catch (error) {
      this.showToast('Error al guardar la publicación.', 'danger');
      console.error('Error al guardar la publicación:', error);
    }
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000, // Duración de 2 segundos
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
