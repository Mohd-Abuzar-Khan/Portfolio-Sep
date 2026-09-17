import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgStyle, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, Project } from '../../core/data/profile';
import { ThemeService } from '../../core/services/theme.service';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, NgStyle, NgClass],
  template: `
    @if (project) {
      <article class="pd">
        <!-- top bar -->
        <div class="pd-top wrap">
          <a class="pd-back" routerLink="/" data-hover>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            All work
          </a>
          <span class="mono pd-slug">/{{ project.slug }}</span>
        </div>

        <!-- hero -->
        <section class="pd-hero wrap">
          <div class="label pd-label" style="margin-bottom:22px">{{ project.role }} · {{ project.year }}</div>
          <h1 class="pd-title">
            <span class="line"><span>{{ titleLine1 }}</span></span>
            @if (titleLine2) { <span class="line"><span class="serif-it">{{ titleLine2 }}</span></span> }
          </h1>
          <p class="pd-tagline">{{ project.tagline }}</p>
          <div class="pd-hero-links">
            <a class="btn primary" [href]="project.liveUrl" target="_blank" rel="noopener" data-hover>
              Visit live site
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </a>
            <a class="btn" [href]="project.githubUrl" target="_blank" rel="noopener" data-hover>Source code</a>
          </div>
        </section>

        <!-- grid: media left / content right -->
        <div class="pd-grid wrap">
          <!-- LEFT: sticky media -->
          <div class="pd-media">
            <div class="pd-media-inner" #mediaInner>
              @for (v of project.videos; track v) {
                <div class="pd-frame" data-parallax>
                  <video [src]="v" autoplay muted loop playsinline></video>
                  <span class="pd-frame-tag mono">demo reel</span>
                </div>
              }
              @for (img of project.images; track img; let i = $index) {
                <div class="pd-frame" data-parallax>
                  <img [src]="img" alt="{{ project.title }} screenshot {{ i + 1 }}" loading="lazy">
                  <span class="pd-frame-tag mono">fig. {{ i + 1 }}</span>
                </div>
              }
            </div>
          </div>

          <!-- RIGHT: scrolling content -->
          <div class="pd-content">
            <section class="pd-block reveal">
              <h3 class="pd-h mono">Overview</h3>
              @for (p of project.overview; track p) { <p class="pd-p">{{ p }}</p> }
            </section>

            <section class="pd-block reveal">
              <h3 class="pd-h mono">Stack</h3>
              <div class="pd-chips">
                @for (s of project.stack; track s) { <span class="tag" data-hover>{{ s }}</span> }
              </div>
            </section>

            <section class="pd-block reveal">
              <h3 class="pd-h mono">Highlights</h3>
              <ul class="pd-list">
                @for (f of project.features; track f) {
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.6"><path d="M20 6L9 17l-5-5"/></svg>
                    {{ f }}
                  </li>
                }
              </ul>
            </section>

            <section class="pd-block reveal">
              <h3 class="pd-h mono">Numbers</h3>
              <div class="pd-stats">
                @for (s of project.stats; track s.label) {
                  <div class="pd-stat">
                    <div class="pd-stat-num">{{ s.value }}<i>{{ s.suffix }}</i></div>
                    <div class="pd-stat-label mono">{{ s.label }}</div>
                  </div>
                }
              </div>
            </section>

            <section class="pd-block reveal">
              <h3 class="pd-h mono">Links</h3>
              <a class="pd-live" [href]="project.liveUrl" target="_blank" rel="noopener" data-hover>
                <span>
                  <b>Live site</b>
                  <small>{{ project.liveUrl }}</small>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>
              <a class="pd-live" [href]="project.githubUrl" target="_blank" rel="noopener" data-hover>
                <span>
                  <b>Repository</b>
                  <small>{{ project.githubUrl }}</small>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>
            </section>

            <!-- next project -->
            @if (next) {
              <a class="pd-next reveal" [routerLink]="['/project', next.slug]" data-view>
                <span class="mono" style="font-size:11px;letter-spacing:.18em;color:var(--muted)">NEXT PROJECT</span>
                <span class="pd-next-title">{{ next.title }}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>
            }
          </div>
        </div>
      </article>
    } @else {
      <div class="pd-missing wrap">
        <p class="mono">project not found — <a routerLink="/" style="color:var(--accent)">back to work</a></p>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .serif-it { font-family: var(--serif); font-style: italic; font-weight: 400; color: var(--accent); }

    .pd { min-height: 100vh; }
    .pd-top { display: flex; justify-content: space-between; align-items: center; padding-top: 96px; margin-bottom: clamp(28px,5vh,56px); }
    .pd-back { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); transition: color .2s; }
    .pd-back:hover { color: var(--accent); }
    .pd-slug { font-size: 12px; color: var(--faint); letter-spacing: .08em; }

    .pd-hero { padding-bottom: clamp(40px,7vh,80px); border-bottom: 1px solid var(--line); }
    .pd-title { font-size: clamp(48px,9vw,130px); line-height: .96; letter-spacing: -.035em; font-weight: 600; }
    .pd-title .line { display: block; overflow: hidden; }
    .pd-title .line > span { display: inline-block; }
    .pd-tagline { margin-top: 22px; max-width: 560px; font-size: clamp(16px,1.6vw,20px); color: var(--ink-dim); line-height: 1.6; }
    .pd-hero-links { display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 13px; padding: 15px 26px; border-radius: 100px; border: 1px solid var(--line); transition: .25s; }
    .btn:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); transform: translateY(-2px); }
    .btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    .btn.primary:hover { filter: brightness(1.1); background: var(--accent); color: #fff; }

    /* grid */
    .pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(30px,5vw,80px); padding-block: clamp(50px,8vh,100px); align-items: start; }
    .pd-media { position: sticky; top: 96px; }
    .pd-media-inner { display: flex; flex-direction: column; gap: 26px; }
    .pd-frame { position: relative; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--line); background: var(--bg3); will-change: transform; }
    .pd-frame img, .pd-frame video { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
    .pd-frame-tag { position: absolute; top: 12px; left: 12px; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; background: rgba(10,10,11,.65); color: #fff; padding: 6px 10px; border-radius: 100px; backdrop-filter: blur(6px); }

    /* right content */
    .pd-content { display: flex; flex-direction: column; gap: clamp(44px,7vh,72px); min-width: 0; }
    .pd-h { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
    .pd-h::before { content: ""; width: 22px; height: 1px; background: var(--accent); }
    .pd-p { color: var(--ink-dim); font-size: clamp(15px,1.35vw,17.5px); line-height: 1.75; margin-bottom: 16px; }
    .pd-chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .tag { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-dim); border: 1px solid var(--line); padding: 8px 14px; border-radius: 100px; transition: .25s; }
    .tag:hover { border-color: var(--accent); color: var(--accent); }
    .pd-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    .pd-list li { display: flex; gap: 12px; align-items: flex-start; color: var(--ink-dim); font-size: 15px; line-height: 1.6; }
    .pd-list svg { flex-shrink: 0; margin-top: 4px; }
    .pd-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
    .pd-stat { border: 1px solid var(--line); border-radius: var(--radius); padding: 22px 18px; background: var(--bg2); }
    .pd-stat-num { font-size: clamp(26px,2.6vw,38px); font-weight: 600; letter-spacing: -.02em; }
    .pd-stat-num i { font-style: normal; color: var(--accent); font-family: var(--serif); }
    .pd-stat-label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-top: 8px; }
    .pd-live { display: flex; justify-content: space-between; align-items: center; gap: 16px; border: 1px solid var(--line); border-radius: var(--radius); padding: 20px 22px; margin-bottom: 12px; transition: .25s; }
    .pd-live:hover { border-color: var(--accent); transform: translateX(6px); }
    .pd-live b { display: block; font-size: 15px; }
    .pd-live small { font-family: var(--mono); font-size: 11px; color: var(--muted); }
    .pd-next { display: flex; justify-content: space-between; align-items: center; gap: 18px; border: 1px dashed var(--line); border-radius: var(--radius); padding: 28px; transition: .3s; }
    .pd-next:hover { border-color: var(--accent); background: var(--accent-soft); }
    .pd-next-title { font-size: clamp(22px,2.4vw,32px); font-weight: 600; letter-spacing: -.01em; flex: 1; }
    .pd-missing { padding: 200px 0; }

    @media (max-width: 900px) {
      .pd-grid { grid-template-columns: 1fr; }
      .pd-media { position: static; }
    }
  `],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  protected project?: Project;
  protected next?: Project;
  protected titleLine1 = '';
  protected titleLine2 = '';

  private route = inject(ActivatedRoute);
  private theme = inject(ThemeService);
  private loaderService = inject(LoaderService);
  private platformId = inject(PLATFORM_ID);
  private triggers: ScrollTrigger[] = [];

  ngOnInit(): void {
    // ★ THE THEME TRANSITION: entering a project → light theme.
    // The 0.9s CSS variable transition on <body> does the smooth fade,
    // layered under the red route-wipe from AppComponent.
    this.theme.set('light');

    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const idx = PROJECTS.findIndex((p) => p.slug === slug);
    this.project = PROJECTS[idx];
    this.next = PROJECTS[(idx + 1) % PROJECTS.length];
    if (this.project) {
      const words = this.project.title.split(' ');
      this.titleLine1 = words[0] ?? this.project.title;
      this.titleLine2 = words.slice(1).join(' ');
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.project) return;
    gsap.registerPlugin(ScrollTrigger);

    const entranceDelay = this.loaderService.isLoaded ? 0.35 : 2.4;

    // hero title rise
    gsap.fromTo('.pd-title .line > span',
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out', delay: entranceDelay });
    gsap.fromTo(['.pd-label', '.pd-tagline', '.pd-hero-links'],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: entranceDelay + 0.15 });

    // right-column content reveals
    gsap.utils.toArray<HTMLElement>('.pd-block, .pd-next').forEach((el) => {
      const tw = gsap.fromTo(el, { opacity: 0, y: 48 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
      if (tw.scrollTrigger) this.triggers.push(tw.scrollTrigger);
    });

    // left-column media parallax drift
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((frame) => {
      const tw = gsap.fromTo(frame, { y: -30 }, {
        y: 30, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
      if (tw.scrollTrigger) this.triggers.push(tw.scrollTrigger);
    });

    // gentle scale-in for each frame as it enters
    gsap.utils.toArray<HTMLElement>('.pd-frame').forEach((frame) => {
      const tw = gsap.fromTo(frame, { scale: 0.94, opacity: 0.4 }, {
        scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: frame, start: 'top 92%' },
      });
      if (tw.scrollTrigger) this.triggers.push(tw.scrollTrigger);
    });
  }

  ngOnDestroy(): void {
    // back to dark when leaving the detail view
    this.theme.set('dark');
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];
  }
}
