import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Componentes/Páginas
import { LandingPage } from './pages/landing/landing';
import { CatalogoPage } from './pages/catalogo/catalogo';
import { ContactoPage } from './pages/contacto/contacto';
import { PrivacyPolicyPage } from './pages/privacy-policy/privacy-policy';
import { QuienesSomosPage } from './pages/quienes-somos/quienes-somos';
import { TerminosServicioPage } from './pages/terminos-servicio/terminos-servicio';
import { LoginPage } from './pages/login/login';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard';
import { NoticiaDetallePage } from './pages/noticia-detalle/noticia-detalle';

@NgModule({
  declarations: [
    App,
    LandingPage,
    CatalogoPage,
    ContactoPage,
    PrivacyPolicyPage,
    QuienesSomosPage,
    TerminosServicioPage,
    LoginPage,
    AdminDashboardPage,
    NoticiaDetallePage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App],
})
export class AppModule {}

