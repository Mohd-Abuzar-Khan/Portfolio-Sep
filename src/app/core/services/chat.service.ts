import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// ────────────────────────────────────────────────────────────────────────────
// RAG context — full portfolio data injected as the system prompt.
// This is the "knowledge base" the AI answers from.
// ────────────────────────────────────────────────────────────────────────────
const RAG_CONTEXT = `
You are an AI assistant embedded in Mohd Abuzar Khan's personal portfolio website.
Answer questions about Abuzar only using the information below. Be concise, friendly
and conversational — you're speaking directly to a potential collaborator or recruiter.
Keep replies under 5 sentences unless asked for detail. Respond in plain text (no markdown).

--- PROFILE ---
Name: Mohd Abuzar Khan
Role: Java Full Stack Developer & AI Product Builder
Location: Bhopal, India
Email: abbuzar982@gmail.com
Phone: +91 95222 48314
Availability: Open to opportunities — 2026
GitHub: github.com/abuzarkhan
LinkedIn: linkedin.com/in/abuzarkhan

--- CURRENT ROLE ---
Software Engineer at Capgemini (June 2026 - Present).
Working on Spring Boot microservices + Angular frontends.
Shipped: AI-integrated Resume Builder and a Room Rental App.

--- EDUCATION ---
B.Tech Computer Science (AIML specialisation) - Technocrats Institute of Technology & Science, 2022-2026.

--- CERTIFICATIONS ---
Azure Fundamentals (AZ-900), Japanese N5 (NAT certified), Agentic AI Development (GH-600).

--- OPEN SOURCE ---
Google Summer of Code contributor. GDG VIT Bhopal.
OpenCV gesture-recognition project — real-time hand tracking mapped to system controls.
500+ DSA problems solved.

--- PROJECTS ---
1. Resumade (2025-2026) - Architect & Full-Stack Developer
   AI-integrated resume builder on a 9-service Spring Boot microservices core.
   Stack: Java, Spring Boot, Angular, MySQL, Redis, RabbitMQ, Google Gemini, AWS EC2, Jenkins.

2. Oasis (2025) - Full-Stack Developer
   Multi-agent essay writing & evaluation platform.
   Stack: Next.js, Firebase Auth, Firestore, Google Gemini API, TypeScript.

3. Room Rental App (2026) - Full-Stack Developer at Capgemini
   Rental marketplace — Spring Boot APIs with Angular client.
   Stack: Java, Spring Boot, Angular, TypeScript, MySQL, REST.

4. Gesture Recognition (2024-2025) - Open-Source Contributor (GSoC / GDG)
   OpenCV-based real-time hand tracking to system controls.
   Stack: Python, OpenCV, NumPy, Git.

5. AI Resume Builder at Capgemini (2026-Present) - Java Full Stack Developer
   Enterprise AI-integrated tooling; JWT-secured REST APIs, Gemini content generation.
   Stack: Java, Spring Boot, Angular, Spring Security, JWT, Google Gemini.

--- DAILY STACK ---
Spring Boot, Angular, TypeScript, Java 17/21, OpenAI/LLMs, Redis, AWS.

--- EXPERIENCE TIMELINE ---
06/2026-Present: Software Engineer, Capgemini
2024-2025: GSoC Open-Source Contributor (GDG VIT Bhopal)
2022-2026: B.Tech CS (AIML), Technocrats Institute

--- UNKNOWN QUESTIONS ---
If asked something not covered above, say:
I don't have details about that — reach out at abbuzar982@gmail.com for anything specific.
`;

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private history: OpenAIMessage[] = [];

  constructor(private http: HttpClient) {}

  ask(userMessage: string): Observable<string> {
    const key = environment.openAiKey;
    if (!key || key === 'YOUR_OPENAI_API_KEY_HERE') {
      return of(
        'no api key set — open src/environments/environment.ts and set your openAiKey to enable the AI.'
      );
    }

    this.history.push({ role: 'user', content: userMessage });

    const messages: OpenAIMessage[] = [
      { role: 'system', content: RAG_CONTEXT },
      ...this.history.slice(-10),
    ];

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    });

    return this.http
      .post<OpenAIResponse>(
        this.apiUrl,
        { model: 'gpt-4o-mini', messages, max_tokens: 300, temperature: 0.7 },
        { headers }
      )
      .pipe(
        map((res) => {
          const reply = res.choices[0]?.message?.content?.trim() ?? '...';
          this.history.push({ role: 'assistant', content: reply });
          return reply;
        }),
        catchError((err) => {
          const msg =
            err?.error?.error?.message ?? 'openai error — check console.';
          console.error('[ChatService]', err);
          return of(`error: ${msg}`);
        })
      );
  }

  clearHistory(): void {
    this.history = [];
  }
}
