import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { supabase } from '../../supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<AuthUser | null>(null);
  private sessionInitialized = false;

  constructor() {
    // Cargar sesión inicial
    this.initSession();

    // Escuchar cambios de sesión (login/logout, refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
  const user = session?.user
    ? { id: session.user.id, email: session.user.email ?? '' }
    : null;
  this.user$.next(user);
})
  }

  private async initSession() {
  if (this.sessionInitialized) return;
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const user = session?.user
    ? { id: session.user.id, email: session.user.email ?? '' }
    : null;
  this.user$.next(user);
  this.sessionInitialized = true;
}

  getUser(): Observable<AuthUser | null> {
    return this.user$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(map(u => !!u));
  }

  signUp(email: string, password: string): Observable<void> {
    return from(
      supabase.auth.signUp({ email, password })
    ).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      })
    );
  }

  signIn(email: string, password: string): Observable<void> {
    return from(
      supabase.auth.signInWithPassword({ email, password })
    ).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      })
    );
  }

  signOut(): Observable<void> {
    return from(
      supabase.auth.signOut()
    ).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      })
    );
  }
}

