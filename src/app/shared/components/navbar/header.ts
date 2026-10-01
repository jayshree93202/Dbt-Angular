import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {

  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  currentDate: Date = new Date();
  private timer: any;
  private subscriptions = new Subscription();

  // Profile / Auth State
  isLoggedIn: boolean = false;
  username: string = '';
  roleId: string = '';
  roleDisplayName: string = '';
  profileDropdownOpen: boolean = false;

  ngOnInit(): void {
    this.updateUserSession();

    // Reactively listen to auth state changes (login, logout)
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((session) => {
        if (session && (session.userId || session.roleId)) {
          this.isLoggedIn = true;
          this.username = session.userId || 'User';
          this.roleId = (session.roleId || '').trim().toUpperCase();
          this.roleDisplayName = this.authService.getRoleDisplayName(this.roleId);
        } else {
          this.updateUserSession();
        }
      })
    );

    // Close dropdown & verify session upon navigation
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.profileDropdownOpen = false;
          this.updateUserSession();
        })
    );

    // Live clock
    this.timer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.subscriptions.unsubscribe();
  }

  updateUserSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserId = localStorage.getItem('UserId') || '';
      const storedRoleId = (localStorage.getItem('RoleId') || '').trim().toUpperCase();
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (token || storedUserId || storedRoleId) {
        this.isLoggedIn = true;
        this.username = storedUserId || 'User';
        this.roleId = storedRoleId;
        this.roleDisplayName = this.authService.getRoleDisplayName(storedRoleId);
        return;
      }
    }
    this.isLoggedIn = false;
    this.username = '';
    this.roleId = '';
    this.roleDisplayName = '';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleProfileDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.profileDropdownOpen = false;
  }

  onLogout(): void {
    this.profileDropdownOpen = false;
    this.isLoggedIn = false;
    this.username = '';
    this.roleId = '';
    this.roleDisplayName = '';

    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.profileDropdownOpen && this.elementRef?.nativeElement) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
      if (!clickedInside) {
        this.profileDropdownOpen = false;
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.profileDropdownOpen = false;
  }
}
