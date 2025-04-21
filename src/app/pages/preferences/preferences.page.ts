import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Preference {
  key: string;
  label: string;
}

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
  standalone: false,
})
export class PreferencesPage implements OnInit {
  preferenceItems: Preference[] = [
    { key: 'futbol11', label: 'Fútbol 11' },
    { key: 'babyFutbol', label: 'Baby fútbol' },
    { key: 'voleibol', label: 'Voleibol' },
    { key: 'voleibolPlaya', label: 'Voleibol playa' },
    { key: 'basquetbol', label: 'Basquetbol' },
    { key: 'tenis', label: 'Tenis' },
    { key: 'padel', label: 'Pádel' },
    { key: 'otros', label: 'Otros' }
  ];

  preferences: { [key: string]: boolean } = {};

  sugerencias: string = '';

  constructor(private router: Router) {
    this.preferenceItems.forEach(item => {
      this.preferences[item.key] = false;
    });
  }

  ngOnInit() {}

  doFinish() {
    console.log('Finalizando selección de preferencias...');

    const selectedPreferences = this.preferenceItems
      .filter(item => this.preferences[item.key])
      .map(item => item.label);

    console.log('Preferencias seleccionadas:', selectedPreferences);
    console.log('Sugerencias:', this.sugerencias);

    this.router.navigateByUrl('/menu'); 
  }

}