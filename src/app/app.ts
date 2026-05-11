import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title = signal('store');

  constructor(
    private router: Router,
    private supabase: SupabaseService
  ) {}

  ngOnInit(): void {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(async (event: any) => {

        const visitData = {
          page: event.urlAfterRedirects,
          path: event.urlAfterRedirects,

          user_agent: navigator.userAgent,
          language: navigator.language,

          screen_width: window.innerWidth,
          screen_height: window.innerHeight,

          referrer: document.referrer || null,

          session_id: this.getSessionId(),
        };

        try {

          await this.supabase.registerView(visitData);

        } catch (error) {

          console.error('Error registrando vista', error);

        }

      });

  }

  getSessionId(): string {

    let sessionId = localStorage.getItem('session_id');

    if (!sessionId) {

      sessionId = crypto.randomUUID();

      localStorage.setItem('session_id', sessionId);

    }

    return sessionId;
  }
}