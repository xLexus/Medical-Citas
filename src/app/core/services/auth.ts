import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private users: User[] = [];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Inicializar usuarios de prueba
    this.initializeUsers();
  }

  private initializeUsers(): void {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      this.users = [
        {
          id: '1',
          nombre: 'Admin Ponluisa',
          email: 'admin@ponluisa.com',
          password: 'admin123',
          rol: 'administrador'
        },
        {
          id: '2',
          nombre: 'Dr. Juan Ponluisa',
          email: 'medico@ponluisa.com',
          password: 'medico123',
          rol: 'medico',
          especialidad: 'Medicina General',
          registroMedico: 'REG-001'
        }
      ];
      localStorage.setItem('users', JSON.stringify(this.users));
    } else {
      this.users = JSON.parse(storedUsers);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): boolean {
    const user = this.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  register(data: RegisterData): boolean {
    // Verificar si el email ya existe
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...data
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.rol === 'administrador';
  }

  isMedico(): boolean {
    return this.currentUserValue?.rol === 'medico';
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getMedicos(): User[] {
    return this.users.filter(u => u.rol === 'medico');
  }
}