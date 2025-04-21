// src/app/components/edit-profile-field-modal/edit-profile-field-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile-field-modal',
  templateUrl: './edit-profile-field-modal.component.html',
  styleUrls: ['./edit-profile-field-modal.component.scss'],
  standalone: false,
  
})
export class EditProfileFieldModalComponent implements OnInit {

  ngOnInit() {
    this.editedValue = this.currentValue;
  }

  @Input() fieldName: string = '';
  @Input() fieldLabel: string = '';
  @Input() currentValue: string = '';
  @Input() fieldType: string = 'text';
  editedValue: string = '';

  constructor(private modalCtrl: ModalController) { }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss(this.editedValue, 'confirm');
  }
}