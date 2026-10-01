
import { Component, inject, Input, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule
} from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit, OnDestroy {

  @Input() isOpen = true;

  // ==========================================
  // VARIABLES
  // ==========================================

  roleId: string = '';
  userId: string = '';
  reportsOpen: boolean = false;
  actionOpen: boolean = false;
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authSubscription?: Subscription;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('UserId') || '';
      this.roleId = localStorage.getItem('RoleId') || '';
    }
  }

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadUserDetails();

    this.authSubscription = this.authService.currentUser$.subscribe((session) => {
      if (session && (session.roleId || session.userId)) {
        this.userId = (session.userId || '').trim();
        this.roleId = (session.roleId || '').trim().toUpperCase();
        this.reportsOpen = true;
      } else {
        this.loadUserDetails();
      }
    });

    // Logged-in user ke liye Reports open
    if (this.isLoggedIn()) {
      this.reportsOpen = true;
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  // ==========================================
  // LOAD USER DETAILS
  // ==========================================

  loadUserDetails(): void {

    if (isPlatformBrowser(this.platformId)) {
      const storedRoleId =
        localStorage.getItem('RoleId') || '';

      const storedUserId =
        localStorage.getItem('UserId') || '';

      this.roleId =
        storedRoleId.trim().toUpperCase();

      this.userId =
        storedUserId.trim();
    }
  }

  // ==========================================
  // ROLE CHECK
  // ==========================================

  isPublic(): boolean {
    return this.roleId === '';
  }

  isSadm(): boolean {
    return this.roleId === 'SADM';
  }

  isDadm(): boolean {
    return this.roleId === 'DADM';
  }

  isDopt(): boolean {
    return this.roleId === 'DOPT';
  }

  isHelp(): boolean {
    return this.roleId === 'HELP';
  }

  isLoggedIn(): boolean {
    return this.roleId !== '';
  }

  // ==========================================
  // REPORTS TOGGLE
  // ==========================================

  toggleReports(): void {
    this.reportsOpen = !this.reportsOpen;
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {
    // Reset sidebar
    this.roleId = '';
    this.userId = '';
    this.reportsOpen = false;
    this.actionOpen = false;
  this.authService.logout();
  this.router.navigate(['/login']);
  }
}
