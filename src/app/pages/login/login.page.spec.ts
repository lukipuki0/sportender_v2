import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing'; // Necesario para probar la navegación
import { FormsModule } from '@angular/forms'; // Importa si usas FormsModule

import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  // Configura el entorno de pruebas antes de cada test ('it')
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule, // Importa el módulo de testing para Router
        FormsModule // Importa si es necesario para tu componente
      ]
    }).compileComponents(); // Compila los componentes (HTML, CSS)

    // Crea una instancia del componente y detecta cambios
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // Ejemplo de una prueba básica: verificar que el componente se crea
  it('should create', () => {
    expect(component).toBeTruthy(); // Comprueba que la instancia del componente existe
  });

  // Aquí podrías añadir más pruebas ('it' blocks) para verificar:
  // - Que las variables iniciales son correctas
  // - Que los métodos (doLogin, goToRegister) hacen lo esperado
  // - Que la navegación se llama correctamente
});