import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home', adminOnly: false },
    { title: 'Pacientes', url: '/patient/list', icon: 'people', adminOnly: false },
    { title: 'Historias Clínicas', url: '/medical-history/list', icon: 'document-text', adminOnly: false },
    { title: 'Médicos', url: '/users/medicos', icon: 'medical', adminOnly: true },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  shouldShowPage(page: any): boolean {
    if (page.adminOnly) {
      return this.isAdmin();
    }
    return true;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}