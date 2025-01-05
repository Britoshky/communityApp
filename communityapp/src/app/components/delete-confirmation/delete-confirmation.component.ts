import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'], 
  standalone: true,
  imports: [IonicModule],
})
export class DeleteConfirmationComponent {
  @Input() publicationTitle!: string;

  constructor(private modalController: ModalController) {}

  confirmDelete() {
    // Devuelve un valor al cerrar el modal
    this.modalController.dismiss({ confirmed: true });
  }

  cancelDelete() {
    // Devuelve un valor al cerrar el modal
    this.modalController.dismiss({ confirmed: false });
  }
}
