import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE, PROJECTS, STACK, EXPERIENCE, CERTS, GALLERY } from '../../core/data/profile';
import { ThemeService } from '../../core/services/theme.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgStyle],
  template: `
    <!-- ================= HERO ================= -->
    <section class="hero" id="top">
      <div class="hero-glow"></div>
      <div class="wrap hero-inner">
        <div class="hero-top">
          <div class="hero-eyebrow">
            <b>{{ profile.name }}</b> — Java Full Stack Developer<br>
            Spring Boot × Angular × AI · Portfolio 2026
          </div>
          <div class="hero-eyebrow right">
            Based in {{ profile.location }}<br>
            <b style="color:var(--accent)">Software Engineer &#64; Capgemini</b>
          </div>
        </div>

        <h1 class="hero-title">
          <span class="line"><span>I build <em>full-stack</em></span></span>
          <span class="line"><span>products &amp; <em class="serif-it">AI</em></span></span>
          <span class="line"><span>systems.</span></span>
        </h1>

        <div class="hero-sub">
          <p>
            <b>Java Full Stack Developer at Capgemini</b> — shipping Spring Boot microservices
            and Angular frontends for AI-integrated products. Nine services, one gateway,
            and a Gemini agent pipeline in between.
          </p>
          <div class="cta-row">
            <a class="btn primary" routerLink="/" fragment="work" data-hover>View selected work
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </a>
            <a class="btn" href="mailto:{{ profile.email }}" data-hover>Contact me</a>
          </div>
        </div>

        <div class="hero-meta">
          <div>Currently<b>Software Engineer · Capgemini</b></div>
          <div>Focus<b>Backend · Frontend · AI</b></div>
          <div>Shipping<b>Java → Angular, daily</b></div>
          <div>Fig. 001<b>Nine services, one gateway</b></div>
        </div>
      </div>
      <div class="scroll-hint">scroll</div>
    </section>

    <!-- ================= TICKER ================= -->
    <div class="ticker">
      <div class="ticker-track">
        @for (t of ticker; track $index) {
          <span><b>0{{ $index + 1 }}</b>{{ t }}</span>
        }
        @for (t of ticker; track $index) {
          <span><b>0{{ $index + 1 }}</b>{{ t }}</span>
        }
      </div>
    </div>

    <!-- ================= WORK ================= -->
    <section class="section" id="work">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="label" style="margin-bottom:18px">01 · Selected work</div>
            <h2>Work that <em class="serif-it">shipped,</em><br>not just compiled.</h2>
          </div>
          <p class="section-note">Hover a row to peek — click to open the case study. Theme shifts lighter inside each project.</p>
        </div>
        <div class="work-list">
          @for (p of projects; track p.slug; let i = $index) {
            <a class="work-item reveal" [routerLink]="['/project', p.slug]" data-view [attr.data-hue]="p.hue">
              <span class="work-idx">0{{ i + 1 }}</span>
              <span>
                <span class="work-name">{{ p.title }}</span>
                <span class="work-role">{{ p.role }} · {{ p.year }}</span>
              </span>
              <span class="work-right">
                <span class="work-tags">
                  @for (t of p.stack.slice(0, 3); track t) { <span class="tag">{{ t }}</span> }
                </span>
                <span class="work-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </span>
              </span>
            </a>
          }
        </div>
      </div>
      <div class="work-preview" #workPreview>
        <div class="work-preview-label" #workPreviewLabel>PROJECT</div>
      </div>
    </section>

    <!-- ================= TERMINAL / AI CHAT ================= -->
    <section class="term-section">
      <div class="wrap section" style="padding-block:clamp(60px,10vh,110px)">
        <div class="term-wrap reveal">
          <div class="label" style="margin-bottom:26px">Ask me anything — AI-powered workspace</div>
          <div class="term-box">
            <div class="term-head">
              <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
              <span>abuzar.dev — rag chatbot — gpt-4o-mini</span>
            </div>
            <div class="term-body" #termBody>
              <div class="out dim">hey! i'm abuzar's AI assistant — ask me about his projects, stack, experience, or anything else.</div>
            </div>
            @if (isThinking) {
              <div class="term-thinking">
                <span class="dot-pulse"></span><span class="dot-pulse"></span><span class="dot-pulse"></span>
                <span class="thinking-label">thinking…</span>
              </div>
            }
            <div class="term-input-row">
              <span class="prompt">❯</span>
              <input #termInput type="text" autocomplete="off" spellcheck="false"
                     [disabled]="isThinking"
                     placeholder="ask me about abuzar…" (keydown.enter)="askAI(termInput)">
            </div>
            <div class="term-keys">
              @for (k of termKeys; track k) {
                <button class="key" data-hover [disabled]="isThinking" (click)="pressKey(k)"><b>❯</b>{{ k }}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= FOCUS ================= -->
    <section class="section" id="focus">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="label" style="margin-bottom:18px">02 · Primarily focused on</div>
            <h2>Three tracks that<br>sharpen <em class="serif-it">each other.</em></h2>
          </div>
          <p class="section-note">Backend depth, frontend craft, and AI workflows — practiced daily.</p>
        </div>
        <div class="tracks">
          <div class="track reveal" data-hover>
            <span class="track-num">TRACK / 01</span><span class="yrs">CORE</span>
            <h3>Full-Stack Engineering</h3>
            <p>Spring Boot microservices to Angular components — REST contracts, JWT security, CI/CD, and the debugging discipline of enterprise delivery.</p>
          </div>
          <div class="track reveal" data-hover>
            <span class="track-num">TRACK / 02</span><span class="yrs">DAILY</span>
            <h3>AI Systems</h3>
            <p>Gemini pipelines, multi-agent evaluation, prompt design — from a rough idea to an AI feature that survives production load.</p>
          </div>
          <div class="track reveal" data-hover>
            <span class="track-num">TRACK / 03</span><span class="yrs">GROWING</span>
            <h3>Open Source & DSA</h3>
            <p>GSoC contributions, GDG VIT Bhopal, and 500+ algorithmic problems — the compounding practice behind clean code.</p>
          </div>
        </div>

        <div class="stats-block">
          <div class="section-head reveal" style="margin-bottom:36px">
            <div>
              <div class="label" style="margin-bottom:18px">03 · By the numbers</div>
              <h2>The journey, <em class="serif-it">counted.</em></h2>
            </div>
          </div>
          <div class="stats-grid reveal">
            <div class="stat" data-hover><div class="stat-num"><span data-count="9">0</span></div><div class="stat-label">Microservices architected</div></div>
            <div class="stat" data-hover><div class="stat-num"><span data-count="500">0</span><i>+</i></div><div class="stat-label">DSA problems solved</div></div>
            <div class="stat" data-hover><div class="stat-num"><span data-count="3">0</span></div><div class="stat-label">Certifications earned</div></div>
            <div class="stat" data-hover><div class="stat-num"><span data-count="2">0</span></div><div class="stat-label">AI products shipped</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= STACK ================= -->
    <section class="section stack-sec" id="stack">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="label" style="margin-bottom:18px">04 · The daily stack</div>
            <h2>Tools I reach for<br><em class="serif-it">every day.</em></h2>
          </div>
          <p class="section-note">From a rough idea to a deployed, working product.</p>
        </div>
        <div class="tools-grid reveal">
          @for (t of stack; track t.name) {
            <div class="tool" data-hover>
              <div class="tool-ico" [ngStyle]="{ color: t.fg }">{{ t.mark }}</div>
              <div><div class="tool-name">{{ t.name }}</div><div class="tool-desc">{{ t.desc }}</div></div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ================= EXPERIENCE ================= -->
    <section class="section" id="experience">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="label" style="margin-bottom:18px">05 · Where I've been</div>
            <h2>From campus to<br><em class="serif-it">Capgemini.</em></h2>
          </div>
        </div>
        <div class="xp-list reveal">
          @for (x of experience; track x.name; let i = $index) {
            <div class="xp-item" data-hover>
              <span class="xp-idx">A{{ i + 1 }}</span>
              <span>
                <span class="xp-name">{{ x.name }}</span>
                <span class="xp-role">{{ x.role }} · {{ x.period }}</span>
                <span class="xp-desc">{{ x.desc }}</span>
              </span>
            </div>
          }
        </div>
        <div class="cert-row reveal">
          @for (c of certs; track c) { <span class="tag cert" data-hover>{{ c }}</span> }
        </div>
      </div>
    </section>

    <!-- ================= 3D GALLERY ================= -->
    <section class="section gallery-sec" id="gallery"
             (mousemove)="onGalleryMove($event)" (mouseleave)="onGalleryLeave()">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="label" style="margin-bottom:18px">06 · Off the clock</div>
            <h2>A few frames,<br><em class="serif-it">tilting with you.</em></h2>
          </div>
          <p class="section-note">Move your cursor to tilt — interactive 3D collage.</p>
        </div>
        <div class="gallery-stage" #galleryStage>
          <div class="gallery-collage" #galleryGrid>

            <!-- MAIN CENTRAL POLAROID FRAME -->
            <div class="g-frame g-main" data-depth="1.4">
              <div class="g-polaroid-inner">
                <img [src]="gallery[0].url" [alt]="gallery[0].caption" loading="lazy">
                <div class="g-polaroid-foot">
                  <span class="handwriting">peek inside ↴</span>
                  <span class="doodle-art">🐱☕</span>
                </div>
              </div>
              <div class="g-glare"></div>
            </div>

            <!-- TOP RIGHT CLUSTER -->
            <div class="g-frame g-card-tr1" data-depth="1.8">
              <div class="clip-icon">📎</div>
              <img [src]="gallery[1].url" [alt]="gallery[1].caption" loading="lazy">
              <div class="g-glare"></div>
            </div>

            <div class="g-frame g-card-tr2" data-depth="2.2">
              <img [src]="gallery[2].url" [alt]="gallery[2].caption" loading="lazy">
              <div class="g-glare"></div>
            </div>

            <div class="g-frame g-card-tr3" data-depth="1.1">
              <img [src]="gallery[3].url" [alt]="gallery[3].caption" loading="lazy">
              <div class="g-glare"></div>
            </div>

            <!-- BOTTOM LEFT CLUSTER -->
            <div class="g-frame g-card-bl-bg" data-depth="0.9">
              <img [src]="gallery[4].url" [alt]="gallery[4].caption" loading="lazy">
              <div class="g-glare"></div>
            </div>

            <div class="g-frame g-note-card" data-depth="2.4">
              <div class="flower-pin">🌺</div>
              <p class="note-text">
                I connect the dots between people, problems &amp; products.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- ================= ABOUT ================= -->
    <section class="section about-sec" id="about">
      <div class="wrap about-strip">
        <div class="reveal">
          <div class="label" style="margin-bottom:26px">07 · About me</div>
          <p class="big">
            I'm a <b>Java full-stack developer</b> who thinks in systems — nine
            microservices behind a gateway, a Gemini pipeline in the middle, and an
            Angular client on top. Lately, I've been designing <b>multi-agent AI workflows</b>
            that grade essays and write resumes. I believe the best portfolio is
            the product still running — so I keep shipping.
          </p>
        </div>
        <div class="about-side reveal">
          <div class="fact" data-hover><b>Currently</b>Software Engineer at Capgemini — Java Full Stack, shipping AI-integrated products since June 2026.</div>
          <div class="fact" data-hover><b>Education</b>B.Tech Computer Science (AIML), Technocrats Institute of Technology &amp; Science, 2022–2026.</div>
          <div class="fact" data-hover><b>Certifications</b>Azure Fundamentals (AZ-900) · Japanese N5 (NAT) · Agentic AI Development (GH-600).</div>
        </div>
      </div>
    </section>

    <!-- ================= CHESS ================= -->
    <section class="section chess-sec" id="chess">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="label" style="margin-bottom:18px">08 · Off the board</div>
            <h2>Play chess <br><em class="serif-it">with me.</em></h2>
          </div>
          <p class="section-note">Active player on Chess.com — feel free to send a live challenge anytime.</p>
        </div>

        <div class="chess-card-container reveal">
          <!-- Top Hero Card: Profile Banner -->
          <div class="chess-profile-banner">
            <div class="chess-banner-left">
              <div class="chess-avatar-wrap">
                <img class="chess-avatar-img" [src]="chessProfile.avatar" alt="z4ry Chess.com Avatar" />
                <span class="chess-avatar-badge" title="Chess.com Active">♟</span>
              </div>
              <div class="chess-user-meta">
                <div class="chess-user-row">
                  <h3 class="chess-username">{{ chessProfile.username }}</h3>
                  <span class="chess-league-pill">{{ chessProfile.league }}</span>
                </div>
                <div class="chess-fullname">{{ chessProfile.displayName }} <span class="chess-native-name">(ابوذر خان)</span> · {{ chessProfile.countryFlag }} {{ chessProfile.location }}</div>
                <div class="chess-meta-tags">
                  <span class="meta-tag"><b>{{ chessProfile.followers }}</b> followers</span>
                  <span class="meta-tag-dot">·</span>
                  <span class="meta-tag"><b>{{ chessProfile.totalGames }}</b> rated games</span>
                  <span class="meta-tag-dot">·</span>
                  <span class="meta-tag">Sicilian Defence player</span>
                </div>
              </div>
            </div>

            <div class="chess-banner-actions">
              <a class="chess-btn-challenge" [href]="chessProfile.challengeUrl" target="_blank" rel="noopener">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M19 13l2 2-6 6-2-2M14.5 6.5L18 3h3v3l-3.5 3.5M6 14l-3 3v4h4l3-3"/>
                </svg>
                Challenge me on Chess.com
              </a>
              <a class="chess-btn-profile" [href]="chessProfile.profileUrl" target="_blank" rel="noopener">
                View profile
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="chess-stats-grid">
            <!-- Rapid -->
            <div class="chess-stat-card primary-stat" data-hover>
              <div class="stat-top">
                <div class="stat-icon-wrap rapid-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <span class="stat-mode-badge">Rapid (10 min)</span>
                <span class="stat-peak">Peak {{ chessProfile.rapid.peak }}</span>
              </div>
              <div class="stat-main">
                <div class="stat-num-row">
                  <span class="stat-rating">{{ chessProfile.rapid.rating }}</span>
                  <span class="stat-unit">rating</span>
                </div>
                <div class="stat-record-pills">
                  <span class="rec-win"><b>{{ chessProfile.rapid.win }}</b> W</span>
                  <span class="rec-draw"><b>{{ chessProfile.rapid.draw }}</b> D</span>
                  <span class="rec-loss"><b>{{ chessProfile.rapid.loss }}</b> L</span>
                </div>
                <!-- Win rate ratio bar -->
                <div class="stat-bar-track" title="Win / Draw / Loss distribution">
                  <div class="stat-bar-seg bar-win" style="width: 50.1%"></div>
                  <div class="stat-bar-seg bar-draw" style="width: 6.5%"></div>
                  <div class="stat-bar-seg bar-loss" style="width: 43.4%"></div>
                </div>
                <div class="stat-desc">Primary competitive rating · 1,458 rated games</div>
              </div>
            </div>

            <!-- Blitz -->
            <div class="chess-stat-card" data-hover>
              <div class="stat-top">
                <div class="stat-icon-wrap blitz-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <span class="stat-mode-badge">Blitz (3-5 min)</span>
                <span class="stat-peak">Peak {{ chessProfile.blitz.peak }}</span>
              </div>
              <div class="stat-main">
                <div class="stat-num-row">
                  <span class="stat-rating">{{ chessProfile.blitz.rating }}</span>
                  <span class="stat-unit">rating</span>
                </div>
                <div class="stat-record-pills">
                  <span class="rec-win"><b>{{ chessProfile.blitz.win }}</b> W</span>
                  <span class="rec-draw"><b>{{ chessProfile.blitz.draw }}</b> D</span>
                  <span class="rec-loss"><b>{{ chessProfile.blitz.loss }}</b> L</span>
                </div>
                <div class="stat-desc">Fast-paced tactical scramble · 1,397 rated games</div>
              </div>
            </div>

            <!-- Tactics & Puzzles -->
            <div class="chess-stat-card" data-hover>
              <div class="stat-top">
                <div class="stat-icon-wrap tactics-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
                </div>
                <span class="stat-mode-badge">Tactics / Puzzles</span>
                <span class="stat-peak">Rush: {{ chessProfile.tactics.puzzleRush }}</span>
              </div>
              <div class="stat-main">
                <div class="stat-num-row">
                  <span class="stat-rating">{{ chessProfile.tactics.rating }}</span>
                  <span class="stat-unit">peak rating</span>
                </div>
                <div class="stat-pill-row">
                  <span class="puzzle-pill">🧩 Peak Tactics <b>{{ chessProfile.tactics.rating }}</b></span>
                  <span class="puzzle-pill">🔥 Puzzle Rush <b>{{ chessProfile.tactics.puzzleRush }}</b></span>
                </div>
                <div class="stat-desc">Pattern calculation, multi-move tactical combinations</div>
              </div>
            </div>

            <!-- Bullet -->
            <div class="chess-stat-card" data-hover>
              <div class="stat-top">
                <div class="stat-icon-wrap bullet-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span class="stat-mode-badge">Bullet (1 min)</span>
                <span class="stat-peak">Peak {{ chessProfile.bullet.peak }}</span>
              </div>
              <div class="stat-main">
                <div class="stat-num-row">
                  <span class="stat-rating">{{ chessProfile.bullet.rating }}</span>
                  <span class="stat-unit">rating</span>
                </div>
                <div class="stat-record-pills">
                  <span class="rec-win"><b>{{ chessProfile.bullet.win }}</b> W</span>
                  <span class="rec-draw"><b>{{ chessProfile.bullet.draw }}</b> D</span>
                  <span class="rec-loss"><b>{{ chessProfile.bullet.loss }}</b> L</span>
                </div>
                <div class="stat-desc">Ultra-fast reflex intuition · 69 rated games</div>
              </div>
            </div>
          </div>

          <!-- Preferences & Style Strip -->
          <div class="chess-insights-row">
            <div class="insight-item">
              <span class="insight-icon">♟️</span>
              <div>
                <span class="insight-label">Favourite Opening</span>
                <strong class="insight-val">Sicilian Defence & King's Indian</strong>
              </div>
            </div>
            <div class="insight-item">
              <span class="insight-icon">⚔️</span>
              <div>
                <span class="insight-label">Play Style</span>
                <strong class="insight-val">Tactical Aggressor & King Hunts</strong>
              </div>
            </div>
            <div class="insight-item">
              <span class="insight-icon">🟢</span>
              <div>
                <span class="insight-label">Live Status</span>
                <strong class="insight-val">Open for Live Challenges</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    em.serif-it { font-family: var(--serif); font-style: italic; font-weight: 400; color: var(--accent); }

    /* hero */
    .hero { min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; padding: 120px 0 40px; position: relative; overflow: hidden; background-color: #F5F1E8; background-image: linear-gradient(rgba(175, 190, 205, 0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(175, 190, 205, 0.24) 1px, transparent 1px); background-size: 28px 28px; background-position: -1px -1px; }
    .hero-glow { position: absolute; width: 60vw; height: 60vw; border-radius: 50%; background: radial-gradient(circle, rgba(255,7,59,.12), transparent 65%); top: -25vw; right: -15vw; pointer-events: none; filter: blur(30px); }
    .hero-inner { position: relative; }
    .hero-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: clamp(24px,4vh,48px); flex-wrap: wrap; gap: 16px; }
    .hero-eyebrow { font-family: var(--mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); line-height: 1.9; }
    .hero-eyebrow b { color: var(--ink); font-weight: 500; }
    .hero-eyebrow.right { text-align: right; }
    .hero-title { font-size: clamp(42px, 8.4vw, 132px); line-height: .98; letter-spacing: -.03em; font-weight: 600; color: #181715; }
    .hero-title .line { display: block; overflow: hidden; }
    .hero-title .line > span { display: inline-block; }
    .hero-title em { font-family: var(--serif); font-style: italic; font-weight: 400; color: var(--accent); }
    .hero-sub { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; margin-top: clamp(28px,4vh,52px); flex-wrap: wrap; }
    .hero-sub p { max-width: 540px; color: var(--ink-dim); font-size: clamp(15px,1.3vw,18px); line-height: 1.65; }
    .hero-sub p b { color: var(--ink); font-weight: 500; }
    .cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 13px; letter-spacing: .04em; padding: 15px 26px; border-radius: 100px; border: 1px solid var(--line); color: var(--ink); background: #FAF5EE; transition: .25s; }
    .btn:hover { background: var(--ink); color: #FAF5EE; border-color: var(--ink); transform: translateY(-2px); }
    .btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    .btn.primary:hover { background: #E00030; border-color: #E00030; }
    .hero-meta { display: flex; border-top: 1px solid var(--line); margin-top: clamp(30px,5vh,56px); font-family: var(--mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--faint); flex-wrap: wrap; }
    .hero-meta div { padding: 16px 28px 0 0; margin-right: 28px; }
    .hero-meta b { display: block; color: var(--muted); font-weight: 500; margin-top: 4px; }
    .scroll-hint { position: absolute; right: clamp(20px,4vw,64px); top: 50%; font-family: var(--mono); font-size: 10px; letter-spacing: .3em; text-transform: uppercase; color: var(--faint); writing-mode: vertical-rl; display: flex; align-items: center; gap: 12px; }
    .scroll-hint::after { content: ""; width: 1px; height: 56px; background: linear-gradient(var(--accent), transparent); }
    @media (max-width: 860px) { .scroll-hint { display: none; } }

    /* ticker */
    .ticker { border-block: 1px solid var(--line); overflow: hidden; padding: 18px 0; background: #EBE5D8; }
    .ticker-track { display: flex; gap: 64px; width: max-content; animation: ticker 26s linear infinite; font-family: var(--mono); font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: #555046; white-space: nowrap; }
    .ticker-track span b { color: var(--accent); margin-right: 12px; }
    @keyframes ticker { to { transform: translateX(-50%); } }

    /* section head */
    .section { padding: clamp(80px,12vh,150px) 0; position: relative; }
    .section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: clamp(36px,6vh,64px); gap: 24px; flex-wrap: wrap; }
    h2 { font-size: clamp(32px,4.6vw,64px); letter-spacing: -.02em; line-height: 1.05; font-weight: 600; color: #181715; }
    .section-note { font-family: var(--mono); font-size: 12px; color: var(--muted); max-width: 300px; line-height: 1.7; text-align: right; }
    @media (max-width: 860px) { .section-note { text-align: left; } }

    /* work list (Editorial Cream Canvas) */
    .work-sec { background-color: #FAF5EE; }
    .work-list { border-top: 1px solid var(--line); }
    .work-item { display: grid; grid-template-columns: 70px 1fr auto; align-items: center; gap: 24px; padding: 32px 8px; border-bottom: 1px solid var(--line); transition: background .3s, padding .3s; }
    .work-item:hover { background: #F3ECE0; padding-left: 24px; }
    .work-idx { font-family: var(--mono); font-size: 12px; color: var(--faint); transition: color .3s; }
    .work-item:hover .work-idx { color: var(--accent); }
    .work-name { font-size: clamp(20px,2.4vw,30px); font-weight: 600; letter-spacing: -.01em; display: block; color: #181715; }
    .work-role { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-top: 6px; display: block; }
    .work-right { display: flex; align-items: center; gap: 18px; }
    .work-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .tag { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-dim); border: 1px solid var(--line); background: #FFFFFF; padding: 6px 12px; border-radius: 100px; transition: .25s; }
    .work-item:hover .tag { border-color: var(--accent); color: var(--accent); }
    .work-arrow { width: 44px; height: 44px; border: 1px solid var(--line); background: #FFFFFF; border-radius: 50%; display: grid; place-items: center; transition: .3s; }
    .work-item:hover .work-arrow { background: var(--accent); border-color: var(--accent); transform: rotate(45deg); }
    .work-item:hover .work-arrow svg { stroke: #fff; }
    .work-preview { position: fixed; width: 300px; height: 200px; border-radius: var(--radius); pointer-events: none; z-index: 90; opacity: 0; transform: scale(.85) rotate(-3deg); transition: opacity .3s, transform .3s; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 20px 40px rgba(0,0,0,0.25); }
    .work-preview.show { opacity: 1; transform: scale(1) rotate(0); }
    .work-preview-label { position: absolute; inset: 0; display: grid; place-items: center; font-family: var(--mono); font-size: 12px; font-weight: 600; letter-spacing: .1em; color: rgba(255,255,255,.9); }
    @media (max-width: 860px) { .work-item { grid-template-columns: 44px 1fr auto; } .work-tags { display: none; } .work-preview { display: none; } }

    /* terminal (Graph Paper Canvas + Dark Console) */
    .term-section { background-color: #F2EDE2; background-image: linear-gradient(rgba(175, 190, 205, 0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(175, 190, 205, 0.22) 1px, transparent 1px); background-size: 26px 26px; border-block: 1px solid var(--line); }
    .term-wrap { max-width: 860px; margin: 0 auto; }
    .term-box { border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); overflow: hidden; background: #11100F; box-shadow: 0 30px 80px rgba(0,0,0,.35); color: #ECE9E2; }
    .term-head { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.1); font-family: var(--mono); font-size: 11px; color: #8B8B85; letter-spacing: .06em; background: #181716; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.r { background: #ff5f57; } .dot.y { background: #febc2e; } .dot.g { background: #28c840; }
    .term-body { font-family: var(--mono); font-size: 13.5px; line-height: 1.8; padding: 22px 18px 26px; min-height: 260px; max-height: 340px; overflow-y: auto; color: #B9B6AE; }
    .term-body .out { white-space: pre-wrap; word-break: break-word; margin-bottom: 4px; }
    .term-body .out.user { color: #ECE9E2; }
    .term-body .out.ai { color: #B9B6AE; padding-left: 18px; border-left: 2px solid var(--accent); margin-bottom: 10px; }
    .term-body .accent { color: var(--accent); }
    .term-body .dim { color: #6C6C68; }
    .term-thinking { display: flex; align-items: center; gap: 5px; padding: 0 18px 14px; background: #11100F; }
    .thinking-label { font-family: var(--mono); font-size: 11px; color: #6C6C68; margin-left: 4px; }
    .dot-pulse { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: pulse 1.2s ease-in-out infinite; opacity: 0.7; }
    .dot-pulse:nth-child(2) { animation-delay: .2s; }
    .dot-pulse:nth-child(3) { animation-delay: .4s; }
    @keyframes pulse { 0%,100% { transform: scale(1); opacity:.4; } 50% { transform: scale(1.4); opacity:1; } }
    .term-input-row { display: flex; align-items: center; gap: 10px; padding: 0 18px 22px; font-family: var(--mono); font-size: 13.5px; background: #11100F; }
    .prompt { color: var(--accent); font-weight: 600; }
    .term-input-row input { flex: 1; background: none; border: 0; outline: 0; color: #ECE9E2; font-family: var(--mono); font-size: 13.5px; caret-color: var(--accent); }
    .term-input-row input:disabled { opacity: 0.4; cursor: not-allowed; }
    .term-keys { display: flex; gap: 8px; flex-wrap: wrap; padding: 0 18px 20px; background: #11100F; }
    .key { font-family: var(--mono); font-size: 11px; color: #8B8B85; border: 1px solid rgba(255,255,255,0.15); border-radius: 7px; padding: 6px 12px; transition: .2s; }
    .key:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .key:disabled { opacity: 0.35; cursor: not-allowed; }
    .key b { color: var(--accent); margin-right: 6px; }

    /* tracks (Matches canvas background seamlessly) */
    .tracks-sec { background-color: var(--bg); }
    .tracks { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
    .track { border: 1px solid var(--line); border-radius: var(--radius); padding: 32px 28px; background: var(--bg); box-shadow: none; transition: transform .35s, border-color .35s, box-shadow .35s, background .35s; position: relative; overflow: hidden; }
    .track:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 16px 40px rgba(255,7,59,.08); background: var(--bg); }
    .track-num { font-family: var(--mono); font-size: 11px; color: var(--faint); letter-spacing: .2em; }
    .track h3 { font-size: clamp(20px,2vw,26px); margin: 52px 0 12px; letter-spacing: -.01em; color: #181715; font-family: var(--sans); font-weight: 600; }
    .track p { color: var(--muted); font-size: 14px; line-height: 1.7; font-family: var(--sans); }
    .yrs { position: absolute; top: 26px; right: 26px; font-family: var(--mono); font-size: 11px; letter-spacing: .1em; color: var(--accent); border: 1px solid rgba(255,7,59,.3); background: rgba(255,7,59,.04); border-radius: 100px; padding: 6px 12px; }
    @media (max-width: 860px) { .tracks { grid-template-columns: 1fr; } }

    /* stats (Matches canvas background seamlessly) */
    .stats-block { margin-top: clamp(60px,9vh,110px); }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: var(--bg); }
    .stat { padding: 44px 32px; border-right: 1px solid var(--line); background: var(--bg); transition: background .3s; }
    .stat:last-child { border-right: 0; }
    .stat:hover { background: rgba(0, 0, 0, 0.02); }
    .stat-num { font-size: clamp(38px,4.8vw,68px); font-weight: 600; letter-spacing: -.03em; line-height: 1; display: flex; align-items: baseline; color: #181715; font-family: var(--sans); }
    .stat-num i { font-style: normal; color: var(--accent); font-family: var(--serif); font-size: .7em; margin-left: 4px; }
    .stat-label { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-top: 16px; }
    @media (max-width: 860px) { .stats-grid { grid-template-columns: 1fr 1fr; } .stat:nth-child(2) { border-right: 0; } .stat:nth-child(1), .stat:nth-child(2) { border-bottom: 1px solid var(--line); } }

    /* stack (Graph Paper Canvas + Matching Cards) */
    .stack-sec { background-color: #F4F0E6; background-image: linear-gradient(rgba(175, 190, 205, 0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(175, 190, 205, 0.22) 1px, transparent 1px); background-size: 26px 26px; border-block: 1px solid var(--line); }
    .tools-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
    .tool { background: var(--bg); padding: 32px 26px; display: flex; flex-direction: column; gap: 36px; transition: background .3s; min-height: 180px; }
    .tool:hover { background: rgba(0, 0, 0, 0.02); }
    .tool-ico { width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; font-family: var(--mono); font-weight: 600; font-size: 15px; border: 1px solid rgba(0,0,0,0.08); background: #EDE5D8; transition: transform .3s; }
    .tool:hover .tool-ico { transform: rotate(-8deg) scale(1.08); }
    .tool-name { font-weight: 600; font-size: 16px; color: #181715; }
    .tool-desc { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 6px; line-height: 1.6; }
    @media (max-width: 860px) { .tools-grid { grid-template-columns: 1fr 1fr; } }

    /* experience */
    .xp-list { border-top: 1px solid var(--line); }
    .xp-item { display: grid; grid-template-columns: 64px 1fr; gap: 24px; padding: 26px 8px; border-bottom: 1px solid var(--line); transition: background .3s, padding .3s; }
    .xp-item:hover { background: #FAF3E8; padding-left: 22px; }
    .xp-idx { font-family: var(--serif); font-style: italic; font-size: 20px; color: #686359; transition: color .3s; }
    .xp-item:hover .xp-idx { color: var(--accent); }
    .xp-name { font-size: clamp(18px,2vw,26px); font-weight: 600; display: block; color: #181715; }
    .xp-role { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin-top: 5px; display: block; }
    .xp-desc { font-size: 13.5px; color: #3A3731; margin-top: 6px; max-width: 580px; display: block; line-height: 1.6; }
    .cert-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 36px; }
    .cert:hover { border-color: var(--accent); color: var(--accent); }

    /* gallery (Graph Paper Canvas - Directly matching Image 2!) */
    .gallery-sec { background-color: #F4F0E8; background-image: linear-gradient(rgba(175, 190, 205, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(175, 190, 205, 0.25) 1px, transparent 1px); background-size: 28px 28px; border-block: 1px solid var(--line); overflow: hidden; }
    .gallery-stage { perspective: 1200px; display: flex; justify-content: center; align-items: center; padding: 40px 0 60px; position: relative; }
    .gallery-collage { position: relative; width: min(100%, 820px); height: 530px; display: flex; justify-content: center; align-items: center; transform-style: preserve-3d; will-change: transform; }
    
    .g-frame { position: absolute; transform-style: preserve-3d; will-change: transform; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.25), 0 2px 10px rgba(0,0,0,0.15); transition: box-shadow .4s; }
    .g-glare { position: absolute; inset: 0; background: radial-gradient(500px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,.22), transparent 45%); opacity: 0; transition: opacity .3s; pointer-events: none; border-radius: inherit; }
    .g-frame:hover .g-glare { opacity: 1; }

    /* Main Central Polaroid */
    .g-main { width: 330px; background: #fbf8f3; padding: 14px 14px 16px 14px; border-radius: 6px; z-index: 10; border: 1px solid rgba(0,0,0,0.08); transform: rotate(1deg); }
    .g-main img { width: 100%; height: 340px; object-fit: cover; border-radius: 3px; display: block; filter: contrast(1.04); }
    .g-polaroid-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding: 0 4px; color: #2d2b27; }
    .handwriting { font-family: var(--serif); font-style: italic; font-size: 18px; color: #2d2b27; letter-spacing: .02em; }
    .doodle-art { font-size: 16px; opacity: .85; }

    /* Top Right Cluster */
    .g-card-tr1 { width: 140px; height: 160px; background: #fbf8f3; padding: 7px; right: 130px; top: 15px; z-index: 20; transform: rotate(7deg); border: 1px solid rgba(0,0,0,0.08); }
    .g-card-tr1 img { width: 100%; height: 100%; object-fit: cover; border-radius: 3px; }
    .clip-icon { position: absolute; top: -14px; left: 50%; transform: translateX(-50%) rotate(-12deg); font-size: 24px; z-index: 25; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }

    .g-card-tr2 { width: 130px; height: 150px; background: #fbf8f3; padding: 7px; right: 240px; top: 45px; z-index: 18; transform: rotate(-9deg); border: 1px solid rgba(0,0,0,0.08); }
    .g-card-tr2 img { width: 100%; height: 100%; object-fit: cover; border-radius: 3px; }

    .g-card-tr3 { width: 135px; height: 145px; background: #fbf8f3; padding: 7px; right: 45px; top: 80px; z-index: 15; transform: rotate(12deg); border: 1px solid rgba(0,0,0,0.08); }
    .g-card-tr3 img { width: 100%; height: 100%; object-fit: cover; border-radius: 3px; }

    /* Bottom Left Cluster */
    .g-note-card { width: 270px; background: #f3ebd9; border-radius: 4px; padding: 26px 22px 22px; left: 70px; bottom: 30px; z-index: 25; transform: rotate(-5deg); box-shadow: 0 16px 36px rgba(0,0,0,0.22); border: 1px dashed rgba(150, 130, 90, 0.4); }
    .flower-pin { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 26px; z-index: 30; }
    .note-text { font-family: var(--sans); font-size: 14.5px; font-weight: 600; line-height: 1.45; color: #23201b; text-align: center; }

    .g-card-bl-bg { width: 145px; height: 165px; background: #fbf8f3; padding: 7px; left: 35px; bottom: 85px; z-index: 12; transform: rotate(-15deg); border: 1px solid rgba(0,0,0,0.08); }
    .g-card-bl-bg img { width: 100%; height: 100%; object-fit: cover; border-radius: 3px; }

    /* about */
    .about-sec { background-color: #F5F1E8; }
    .about-strip { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px,6vw,96px); align-items: start; }
    .big { font-size: clamp(18px,2vw,24px); line-height: 1.65; color: #3A3731; }
    .big b { color: #181715; }
    .about-side { display: flex; flex-direction: column; gap: 18px; }
    .fact { border: 1px solid var(--line); border-radius: var(--radius); padding: 20px 22px; font-family: var(--mono); font-size: 12px; color: var(--muted); line-height: 1.7; background: var(--bg); }
    .fact b { color: var(--ink); font-weight: 500; display: block; margin-bottom: 6px; font-size: 13px; font-family: var(--sans); }
    @media (max-width: 860px) { .about-strip { grid-template-columns: 1fr; } }

    /* chess */
    .chess-sec { background-color: #F4EFE6; background-image: linear-gradient(rgba(175, 190, 205, 0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(175, 190, 205, 0.22) 1px, transparent 1px); background-size: 26px 26px; border-block: 1px solid var(--line); }
    .chess-card-container { display: flex; flex-direction: column; gap: 20px; }
    
    /* Top Profile Banner */
    .chess-profile-banner { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: 28px 32px; display: flex; justify-content: space-between; align-items: center; gap: 24px; box-shadow: none; flex-wrap: wrap; }
    .chess-banner-left { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
    .chess-avatar-wrap { position: relative; width: 78px; height: 78px; flex-shrink: 0; }
    .chess-avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2.5px solid #81b64c; box-shadow: 0 4px 16px rgba(129,182,76,0.3); }
    .chess-avatar-badge { position: absolute; bottom: -2px; right: -2px; width: 26px; height: 26px; border-radius: 50%; background: #81b64c; color: #fff; display: grid; place-items: center; font-size: 13px; border: 2.5px solid var(--bg); box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
    
    .chess-user-meta { display: flex; flex-direction: column; }
    .chess-user-row { display: flex; align-items: center; gap: 12px; }
    .chess-username { font-size: clamp(22px,2.4vw,28px); font-weight: 700; color: #181715; letter-spacing: -.02em; margin: 0; line-height: 1.15; font-family: var(--sans); }
    .chess-league-pill { font-family: var(--mono); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 4px 10px; border-radius: 100px; background: #F1E7CF; color: #73571A; border: 1px solid rgba(115,87,26,0.22); }
    .chess-fullname { font-size: 13.5px; color: #4A463F; margin: 4px 0 8px; font-family: var(--sans); }
    .chess-native-name { font-size: 13px; color: #7A756C; }
    .chess-meta-tags { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; color: #787368; flex-wrap: wrap; }
    .chess-meta-tags b { color: #181715; font-weight: 600; }
    .meta-tag-dot { opacity: .5; }
    
    .chess-banner-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .chess-btn-challenge { display: inline-flex; align-items: center; gap: 10px; background: #81b64c; color: #fff; font-family: var(--mono); font-size: 12.5px; font-weight: 600; letter-spacing: .03em; padding: 14px 24px; border-radius: 100px; text-decoration: none; transition: background .25s, transform .2s, box-shadow .25s; box-shadow: 0 4px 14px rgba(129,182,76,0.28); }
    .chess-btn-challenge:hover { background: #6da03c; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(129,182,76,0.38); }
    .chess-btn-profile { display: inline-flex; align-items: center; gap: 8px; background: var(--bg); color: var(--ink); border: 1px solid var(--line); font-family: var(--mono); font-size: 12px; letter-spacing: .03em; padding: 13px 20px; border-radius: 100px; text-decoration: none; transition: .25s; }
    .chess-btn-profile:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); transform: translateY(-2px); }

    /* Stats Grid */
    .chess-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .chess-stat-card { background: var(--bg); border: 1px solid var(--line); border-radius: 14px; padding: 22px 20px; display: flex; flex-direction: column; justify-content: space-between; transition: transform .25s, border-color .25s, box-shadow .25s; }
    .chess-stat-card:hover { transform: translateY(-3px); border-color: rgba(129,182,76,0.4); box-shadow: 0 12px 26px rgba(0,0,0,0.06); }
    .chess-stat-card.primary-stat { border-color: var(--line); background: var(--bg); }

    .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 8px; }
    .stat-icon-wrap { width: 36px; height: 36px; border-radius: 9px; display: grid; place-items: center; flex-shrink: 0; }
    .rapid-icon { background: rgba(129,182,76,0.15); color: #507d24; }
    .blitz-icon { background: rgba(230,138,0,0.15); color: #b86e00; }
    .tactics-icon { background: rgba(255,7,59,0.12); color: var(--accent); }
    .bullet-icon { background: rgba(30,120,225,0.14); color: #1e78e1; }

    .stat-mode-badge { font-family: var(--mono); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #2D2B26; margin-right: auto; margin-left: 8px; }
    .stat-peak { font-family: var(--mono); font-size: 10px; color: #787368; background: #ECE5D7; padding: 2px 7px; border-radius: 4px; white-space: nowrap; }

    .stat-main { display: flex; flex-direction: column; }
    .stat-num-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; }
    .stat-rating { font-family: var(--sans); font-size: 38px; font-weight: 700; color: #181715; line-height: 1; letter-spacing: -0.03em; }
    .stat-unit { font-family: var(--mono); font-size: 11px; text-transform: uppercase; color: #8D887E; letter-spacing: .08em; }

    .stat-record-pills { display: flex; gap: 6px; margin-bottom: 10px; font-family: var(--mono); font-size: 11px; }
    .rec-win { color: #407515; background: rgba(129,182,76,0.14); padding: 3px 8px; border-radius: 5px; }
    .rec-draw { color: #656054; background: rgba(0,0,0,0.06); padding: 3px 8px; border-radius: 5px; }
    .rec-loss { color: #b83333; background: rgba(220,53,69,0.11); padding: 3px 8px; border-radius: 5px; }

    .stat-bar-track { width: 100%; height: 6px; border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 12px; background: rgba(0,0,0,0.07); }
    .stat-bar-seg { height: 100%; }
    .bar-win { background: #81b64c; }
    .bar-draw { background: #AEA79B; }
    .bar-loss { background: #e06262; }

    .stat-pill-row { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
    .puzzle-pill { font-family: var(--mono); font-size: 10.5px; background: #EFE8DA; padding: 4px 8px; border-radius: 5px; color: #322F29; }
    .puzzle-pill b { color: #181715; }

    .stat-desc { font-size: 12px; color: #6E695F; line-height: 1.5; margin-top: auto; font-family: var(--sans); }

    /* Preferences and Insights Row */
    .chess-insights-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .insight-item { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 14px; }
    .insight-icon { font-size: 22px; flex-shrink: 0; }
    .insight-label { display: block; font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: #8D887E; margin-bottom: 2px; }
    .insight-val { font-size: 13.5px; font-weight: 600; color: #181715; }

    @media (max-width: 1024px) {
      .chess-stats-grid { grid-template-columns: repeat(2, 1fr); }
      .chess-insights-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .chess-profile-banner { flex-direction: column; align-items: flex-start; padding: 22px; }
      .chess-banner-actions { width: 100%; flex-direction: column; align-items: stretch; }
      .chess-btn-challenge, .chess-btn-profile { justify-content: center; }
      .chess-stats-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class HomeComponent implements OnInit, OnDestroy {
  protected profile = PROFILE;
  protected projects = PROJECTS;
  protected stack = STACK;
  protected experience = EXPERIENCE;
  protected certs = CERTS;
  protected gallery = GALLERY;
  protected ticker = ['Spring Boot', 'Angular', 'AI Workflows', 'Microservices', 'Gemini Pipelines', 'Open Source', 'DSA ×500'];
  protected termKeys = ['who are you?', 'what projects did you ship?', 'what is your stack?', 'tell me about Resumade', 'how to contact you?', 'are you open to work?'];
  protected isThinking = false;

  /* ---------- Chess.com profile & stats ---------- */
  protected chessProfile = {
    username: 'z4ry',
    displayName: 'Abuzar Khan',
    avatar: 'https://images.chesscomfiles.com/uploads/v1/user/436119355.8dac6b45.200x200o.440f3e103eee.jpg',
    profileUrl: 'https://www.chess.com/member/z4ry',
    challengeUrl: 'https://www.chess.com/play/online/new?opponent=z4ry',
    league: 'Champion League',
    location: 'Bhopal',
    countryFlag: '🇮🇳',
    followers: 25,
    totalGames: '2,900+',
    rapid: { rating: 1210, peak: 1219, win: 731, loss: 632, draw: 95 },
    blitz: { rating: 622, peak: 851, win: 684, loss: 638, draw: 75 },
    bullet: { rating: 493, peak: 519, win: 39, loss: 29, draw: 1 },
    tactics: { rating: 1531, puzzleRush: 26 },
  };

  @ViewChild('workPreview') workPreview?: ElementRef<HTMLElement>;
  @ViewChild('workPreviewLabel') workPreviewLabel?: ElementRef<HTMLElement>;
  @ViewChild('galleryGrid') galleryGrid?: ElementRef<HTMLElement>;
  @ViewChild('termBody') termBody?: ElementRef<HTMLElement>;
  @ViewChildren('termInput') termInputs?: QueryList<ElementRef<HTMLInputElement>>;

  private platformId = inject(PLATFORM_ID);
  private theme = inject(ThemeService);
  private chat = inject(ChatService);
  private triggers: ScrollTrigger[] = [];
  private quickSetters: Array<(x: number, y: number) => void> = [];
  private galleryTween?: gsap.core.Tween;

  ngOnInit(): void {
    this.theme.set('light');
    if (isPlatformBrowser(this.platformId)) {
      this.fetchLiveChessStats();
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    // hero title lines rise
    gsap.fromTo('.hero-title .line > span',
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out', delay: 2.4 });

    // hero content fade
    gsap.fromTo(['.hero-eyebrow', '.hero-sub', '.hero-meta'],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 2.6 });

    // scroll reveals
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
      const tw = gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
      if (tw.scrollTrigger) this.triggers.push(tw.scrollTrigger);
    });

    // counters
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const target = Number(el.dataset['count'] || 0);
      const obj = { v: 0 };
      const tw = gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
      if (tw.scrollTrigger) this.triggers.push(tw.scrollTrigger);
    });

    this.initWorkPreview();
    this.initGallery();
  }

  ngOnDestroy(): void {
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];
    this.galleryTween?.kill();
  }

  /* ---------- work preview follows cursor ---------- */
  private initWorkPreview(): void {
    const pv = this.workPreview?.nativeElement;
    const label = this.workPreviewLabel?.nativeElement;
    if (!pv || !label || matchMedia('(pointer:coarse)').matches) return;
    const qx = gsap.quickTo(pv, 'left', { duration: 0.4, ease: 'power3' });
    const qy = gsap.quickTo(pv, 'top', { duration: 0.4, ease: 'power3' });
    addEventListener('mousemove', (e) => { qx(e.clientX + 24); qy(e.clientY - 100); });
    document.querySelectorAll<HTMLElement>('.work-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const hue = Number(item.dataset['hue'] || 0);
        pv.style.background = `linear-gradient(135deg, hsl(${hue} 80% 56%), hsl(${(hue + 40) % 360} 70% 42%))`;
        label.textContent = item.querySelector('.work-name')?.textContent?.toUpperCase() ?? 'PROJECT';
        pv.classList.add('show');
      });
      item.addEventListener('mouseleave', () => pv.classList.remove('show'));
    });
  }

  /* ---------- 3D gallery ---------- */
  private initGallery(): void {
    const grid = this.galleryGrid?.nativeElement;
    if (!grid) return;
    const qRX = gsap.quickTo(grid, 'rotationX', { duration: 0.7, ease: 'power3' });
    const qRY = gsap.quickTo(grid, 'rotationY', { duration: 0.7, ease: 'power3' });
    this.quickSetters = [(rx, ry) => { qRX(rx); qRY(ry); }];
    // idle float
    this.galleryTween = gsap.to(grid, { y: 10, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  protected onGalleryMove(e: MouseEvent): void {
    const grid = this.galleryGrid?.nativeElement;
    if (!grid || !this.quickSetters.length) return;
    const r = grid.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    this.quickSetters[0](-ny * 12, nx * 14);
    // per-frame depth tilt
    grid.querySelectorAll<HTMLElement>('.g-frame').forEach((card) => {
      const depth = Number(card.dataset['depth'] || 1);
      gsap.to(card, { z: depth * 38, x: nx * depth * 22, y: -ny * depth * 18, duration: 0.6, ease: 'power3' });
      const cr = card.getBoundingClientRect();
      card.style.setProperty('--gx', `${((e.clientX - cr.left) / cr.width) * 100}%`);
      card.style.setProperty('--gy', `${((e.clientY - cr.top) / cr.height) * 100}%`);
    });
  }

  protected onGalleryLeave(): void {
    const grid = this.galleryGrid?.nativeElement;
    if (!grid) return;
    this.quickSetters[0](0, 0);
    grid.querySelectorAll<HTMLElement>('.g-frame').forEach((card) => {
      gsap.to(card, { z: 0, x: 0, y: 0, duration: 0.8, ease: 'power3' });
    });
  }

  /* ---------- AI chat terminal ---------- */
  protected askAI(input: HTMLInputElement): void {
    const raw = input.value.trim();
    if (!raw || this.isThinking) return;
    input.value = '';

    const body = this.termBody?.nativeElement as HTMLElement | null;
    if (!body) return;

    const printRow = (html: string, cls: string) => {
      const d = document.createElement('div');
      d.className = `out ${cls}`;
      d.innerHTML = html;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
    };

    // print user message
    printRow(`<span class="prompt">❯</span> ${escapeHtml(raw)}`, 'user');

    if (raw.toLowerCase() === 'clear') {
      body.innerHTML = '';
      this.chat.clearHistory();
      return;
    }

    this.isThinking = true;

    this.chat.ask(raw).subscribe((reply) => {
      this.isThinking = false;
      printRow(escapeHtml(reply), 'ai');
      body.scrollTop = body.scrollHeight;
      // refocus input after reply
      setTimeout(() => {
        const inp = this.termInputs?.first?.nativeElement;
        if (inp) inp.focus();
      }, 50);
    });
  }

  protected pressKey(k: string): void {
    const input = this.termInputs?.first?.nativeElement;
    if (!input || this.isThinking) return;
    input.value = k;
    this.askAI(input);
    input.value = '';
    input.focus();
  }

  /* ---------- Chess.com live stats sync ---------- */
  private fetchLiveChessStats(): void {
    fetch('https://api.chess.com/pub/player/z4ry/stats')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (data.chess_rapid?.last?.rating) {
          this.chessProfile.rapid.rating = data.chess_rapid.last.rating;
          this.chessProfile.rapid.peak = data.chess_rapid.best?.rating || this.chessProfile.rapid.peak;
          this.chessProfile.rapid.win = data.chess_rapid.record?.win || this.chessProfile.rapid.win;
          this.chessProfile.rapid.loss = data.chess_rapid.record?.loss || this.chessProfile.rapid.loss;
          this.chessProfile.rapid.draw = data.chess_rapid.record?.draw || this.chessProfile.rapid.draw;
        }
        if (data.chess_blitz?.last?.rating) {
          this.chessProfile.blitz.rating = data.chess_blitz.last.rating;
          this.chessProfile.blitz.peak = data.chess_blitz.best?.rating || this.chessProfile.blitz.peak;
          this.chessProfile.blitz.win = data.chess_blitz.record?.win || this.chessProfile.blitz.win;
          this.chessProfile.blitz.loss = data.chess_blitz.record?.loss || this.chessProfile.blitz.loss;
          this.chessProfile.blitz.draw = data.chess_blitz.record?.draw || this.chessProfile.blitz.draw;
        }
        if (data.chess_bullet?.last?.rating) {
          this.chessProfile.bullet.rating = data.chess_bullet.last.rating;
          this.chessProfile.bullet.peak = data.chess_bullet.best?.rating || this.chessProfile.bullet.peak;
          this.chessProfile.bullet.win = data.chess_bullet.record?.win || this.chessProfile.bullet.win;
          this.chessProfile.bullet.loss = data.chess_bullet.record?.loss || this.chessProfile.bullet.loss;
          this.chessProfile.bullet.draw = data.chess_bullet.record?.draw || this.chessProfile.bullet.draw;
        }
        if (data.tactics?.highest?.rating) {
          this.chessProfile.tactics.rating = data.tactics.highest.rating;
        }
        if (data.puzzle_rush?.best?.score) {
          this.chessProfile.tactics.puzzleRush = data.puzzle_rush.best.score;
        }
      })
      .catch(() => {
        // Keeps verified initial data if offline/CORS blocked
      });
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
