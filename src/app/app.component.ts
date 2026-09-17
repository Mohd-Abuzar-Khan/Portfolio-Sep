import { Component, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationStart, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { PROFILE } from './core/data/profile';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  template: `
    <div class="grain"></div>
    <div class="cursor-dot" #cursorDot></div>
    <div class="cursor-ring" #cursorRing></div>
    <div class="wipe" [class.active]="wiping"></div>

    @if (loading) {
      <div class="loader" #loader>
        <div class="loader-content" [class.hidden]="showWelcome">
          <div class="loader-top">
            <span>MK — Portfolio 2026</span>
            <span>fig. 001 — nine services, one gateway</span>
          </div>
          <div class="loader-mid">
            <div class="loader-name">
              @for (ch of nameChars; track $index) {
                <span #nameLetter>{{ ch }}</span>
              }
            </div>
          </div>
          <div class="loader-bottom">
            <div>
              <div class="loader-bar"><i [style.width.%]="pct"></i></div>
              <span style="font-family:var(--mono);font-size:11px;color:#8b8b85;letter-spacing:.14em">COMPILING EXPERIENCE…</span>
            </div>
            <div class="loader-pct"><span>{{ pct }}</span><i>%</i></div>
          </div>
        </div>

        @if (showWelcome) {
          <div class="loader-center-welcome">
            <span class="welcome-minimal">WELCOME</span>
          </div>
        }
      </div>
    }

    <header>
      <div class="wrap nav">
        <a class="logo" routerLink="/" data-hover>
          Abuzar<span class="logo-dot">.</span>
        </a>
        <nav class="nav-links">
          <a routerLink="/" fragment="work" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" data-hover>Work<sup>01</sup></a>
          <a routerLink="/" fragment="stack" data-hover>Stack<sup>02</sup></a>
          <a routerLink="/" fragment="about" data-hover>About<sup>03</sup></a>
          <a routerLink="/" fragment="contact" data-hover>Contact<sup>04</sup></a>
        </nav>
        <div class="nav-right">
          <span class="status"><span class="pulse"></span>Open to work</span>
          <span class="clock" #clock style="font-family:var(--mono)">--:--:--</span>
        </div>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer id="contact">
      <div class="wrap foot-cta">
        <div class="label" style="margin-bottom:24px">04 · Contact</div>
        <h2>Let's build<br><em class="serif-it">something.</em></h2>
        <a class="foot-mail" [href]="'mailto:' + profile.email" data-hover>
          {{ profile.email }}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>
      </div>
      <div class="wrap foot-grid">
        <div>
          <h4>Sitemap</h4>
          <a routerLink="/" fragment="work" data-hover>Work</a>
          <a routerLink="/" fragment="stack" data-hover>Stack</a>
          <a routerLink="/" fragment="about" data-hover>About</a>
        </div>
        <div>
          <h4>Elsewhere</h4>
          @for (l of profile.links; track l.label) {
            <a [href]="l.url" target="_blank" rel="noopener" data-hover>{{ l.label }}</a>
          }
        </div>
        <div>
          <h4>Currently</h4>
          <a data-hover style="color:var(--accent)">● Software Engineer &#64; Capgemini</a>
          <a data-hover>{{ profile.location }}</a>
        </div>
        <div>
          <h4>Status</h4>
          <a routerLink="/" data-hover>Back to top ↑</a>
        </div>
      </div>
      <div class="wrap foot-base">
        <span>© 2026 Mohd Abuzar Khan — designed & built by one human.</span>
        <span>Bhopal, India · <span #clock2>--:--</span> IST</span>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    em.serif-it { font-family: var(--serif); font-style: italic; font-weight: 400; color: var(--accent); }
  `],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  protected profile = PROFILE;
  protected nameChars = 'MOHD ABUZAR KHAN'.split('').map(c => c === ' ' ? '\u00A0' : c);
  protected welcomeChars = 'WELCOME'.split('');
  protected pct = 0;
  protected showWelcome = false;
  protected loading = true;
  protected wiping = false;

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private loaderService = inject(LoaderService);
  private sub?: Subscription;
  private cursorMove?: (e: MouseEvent) => void;
  private cursorOver?: (e: MouseEvent) => void;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initCursor();
      this.initClock();
      this.sub = this.router.events.subscribe((e) => {
        if (e instanceof NavigationStart) this.wiping = true;
        if (e instanceof NavigationEnd) {
          window.scrollTo({ top: 0, behavior: 'auto' });
          setTimeout(() => (this.wiping = false), 450);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initLoader();
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.cursorMove) removeEventListener('mousemove', this.cursorMove);
    if (this.cursorOver) removeEventListener('mouseover', this.cursorOver);
  }

  private initCursor(): void {
    const dot = document.querySelector<HTMLElement>('.cursor-dot');
    const ring = document.querySelector<HTMLElement>('.cursor-ring');
    if (!dot || !ring || matchMedia('(pointer:coarse)').matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    this.cursorMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    };
    const loop = () => {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    };
    this.cursorOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const view = t.closest('.work-item, [data-view]');
      const hov = t.closest('[data-hover], a, button, input');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-hover', !!hov && !view);
    };
    addEventListener('mousemove', this.cursorMove);
    addEventListener('mouseover', this.cursorOver);
    loop();
  }

  private initClock(): void {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      const el = document.querySelector('[\\#clock]') as HTMLElement | null;
    };
    // simpler: direct DOM query each second
    setInterval(() => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      const c1 = document.querySelector('.clock') as HTMLElement | null;
      const c2 = document.querySelector('.foot-base span:last-child span') as HTMLElement | null;
      if (c1) c1.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
      if (c2) c2.textContent = `${p(d.getHours())}:${p(d.getMinutes())}`;
    }, 1000);
  }

  private initLoader(): void {
    // letters rise
    gsap.to('.loader-name span', { y: 0, duration: 0.9, stagger: 0.035, ease: 'power4.out', delay: 0.15 });

    // counter
    const counter = { v: 0 };
    gsap.to(counter, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      delay: 0.15,
      onUpdate: () => {
        this.pct = Math.round(counter.v);
      },
      onComplete: () => {
        this.pct = 100;
        // Fade out all initial loader elements cleanly once count reaches 100
        gsap.to('.loader-content', {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.inOut',
          onComplete: () => {
            this.showWelcome = true;
            // Animate minimal centered welcome text
            setTimeout(() => {
              gsap.to('.welcome-minimal', {
                opacity: 1,
                scale: 1,
                duration: 0.45,
                ease: 'power2.out'
              });
            }, 30);

            // Hold briefly, then exit loader curtain
            setTimeout(() => {
              this.exitLoader();
            }, 850);
          }
        });
      }
    });
  }

  private exitLoader(): void {
    const el = document.querySelector('.loader');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
    gsap.to('.loader', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.1,
      onComplete: () => {
        this.loading = false;
        this.loaderService.isLoaded = true;
      },
    });
  }
}
