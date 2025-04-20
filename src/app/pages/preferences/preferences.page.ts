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
  standalone: false, // Cambia a true si el componente es standalone
  // NO standalone: true
})
export class PreferencesPage implements OnInit {

  // Lista de preferencias para mostrar en el HTML
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

  // Objeto para almacenar el estado de cada preferencia
  preferences: { [key: string]: boolean } = {};

  sugerencias: string = '';

  constructor(private router: Router) {
    // Inicializa el objeto de preferencias basado en preferenceItems
    this.preferenceItems.forEach(item => {
      this.preferences[item.key] = false; // Todas empiezan desmarcadas
    });
  }

  ngOnInit() {
  }

  doFinish() {
    console.log('Finalizando selección de preferencias...');

    // Recopilar las preferencias seleccionadas
    const selectedPreferences = this.preferenceItems
      .filter(item => this.preferences[item.key]) // Filtra solo las marcadas (true)
      .map(item => item.label); // Obtiene el label de las marcadas

    console.log('Preferencias seleccionadas:', selectedPreferences);
    console.log('Sugerencias:', this.sugerencias);

    // --- LÓGICA PARA GUARDAR PREFERENCIAS AQUÍ ---
    // Aquí llamarías a un servicio para guardar 'selectedPreferences' y 'sugerencias'
    // asociadas al perfil del usuario.
    // Por ejemplo:
    // const dataToSave = { preferences: selectedPreferences, suggestions: this.sugerencias };
    // this.profileService.savePreferences(dataToSave).subscribe(success => {
    //   if (success) {
           // Navegar a la página principal/dashboard
    //   } else {
    //      console.error('Error al guardar preferencias');
    //   }
    // });


    // Navegación directa (simulación por ahora)
    // Como no es obligatorio marcar, simplemente navegamos
    this.router.navigateByUrl('/menu'); 
  }

}