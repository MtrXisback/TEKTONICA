import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing';
import { CatalogoPage } from './pages/catalogo/catalogo';
import { ContactoPage } from './pages/contacto/contacto';
import { PrivacyPolicyPage } from './pages/privacy-policy/privacy-policy';
import { QuienesSomosPage } from './pages/quienes-somos/quienes-somos';
import { TerminosServicioPage } from './pages/terminos-servicio/terminos-servicio';
import { LoginPage } from './pages/login/login';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard';
import { NoticiaDetallePage } from './pages/noticia-detalle/noticia-detalle';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'catalogo', component: CatalogoPage },
  { path: 'contacto', component: ContactoPage },
  { path: 'privacy-policy', component: PrivacyPolicyPage },
  { path: 'quienes-somos', component: QuienesSomosPage },
  { path: 'terminos-de-servicio', component: TerminosServicioPage },
  { path: 'login', component: LoginPage },
  { path: 'admin', component: AdminDashboardPage, canActivate: [AuthGuard] },
  { path: 'novedades/:id', component: NoticiaDetallePage },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

