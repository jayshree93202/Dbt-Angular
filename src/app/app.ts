import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnInit
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/navbar/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Sidebar,
    Header,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  isSidebarOpen = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}


  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {

      this.setInitialSidebarState();

    }

  }


  setInitialSidebarState(): void {

    if (window.innerWidth <= 768) {

      this.isSidebarOpen = false;

    } else {

      this.isSidebarOpen = true;

    }

  }


  toggleSidebar(): void {

    this.isSidebarOpen = !this.isSidebarOpen;

  }


  closeSidebar(): void {

    this.isSidebarOpen = false;

  }


  @HostListener('window:resize')
  onResize(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (window.innerWidth <= 768) {

      this.isSidebarOpen = false;

    }

  }

}