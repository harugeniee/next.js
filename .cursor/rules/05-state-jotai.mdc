---
alwaysApply: true
---

# State Management (Jotai)

## Overview

This app uses **two state management approaches**:

| Type | Tool | Use Case |
|------|------|----------|
| Server State | TanStack Query | API data, caching, sync |
| Client State | Jotai | Auth, UI state, preferences |

## Jotai Basics

Jotai provides atomic state management. Each atom is an independent piece of state.

```typescript
import { atom, useAtom } from "jotai";

// Define atom
const countAtom = atom(0);

// Use in component
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Auth Store

Located in `@/lib/auth/auth-store.ts`:

```typescript
"use client";

import { atom, useAtom } from "jotai";
import type { User } from "@/lib/interface";

// Auth atoms
export const accessTokenAtom = atom<string | null>(null);
export const currentUserAtom = atom<User | null>(null);
export const authLoadingAtom = atom<boolean>(false);
export const userProfileLoadingAtom = atom<boolean>(false);
```

### Usage in Components

```typescript
import { useAtom } from "jotai";
import { currentUserAtom, authLoadingAtom } from "@/lib/auth";

function UserProfile() {
  const [user] = useAtom(currentUserAtom);
  const [isLoading] = useAtom(authLoadingAtom);
  
  if (isLoading) return <Skeleton />;
  if (!user) return <LoginPrompt />;
  
  return <div>Welcome, {user.name}</div>;
}
```

### Auth Actions

The auth store provides action functions for authentication:

```typescript
// src/lib/auth/auth-store.ts

// Login with email/password
export async function loginAction(email: string, password: string): Promise<User> {
  const { user, token } = await AuthAPI.login({ email, password });
  storeTokens(token.accessToken, token.refreshToken);
  return user;
}

// OAuth login
export async function loginWithGoogleAction(): Promise<User> {
  const firebaseUser = await signInWithGoogle();
  const idToken = await firebaseUser.getIdToken();
  const { user, token } = await AuthAPI.firebaseLogin({ idToken });
  storeTokens(token.accessToken, token.refreshToken);
  return user;
}

// Logout
export async function logoutAction() {
  await FirebaseAuthAPI.signOut();
  await AuthAPI.logout();
  clearUserState();
}

// Fetch current user
export async function fetchMeAction(): Promise<User> {
  return AuthAPI.fetchMe();
}
```

### Using Auth Actions in Components

```typescript
import { useAtom } from "jotai";
import { 
  currentUserAtom, 
  authLoadingAtom, 
  loginAction, 
  logoutAction 
} from "@/lib/auth";

function LoginForm() {
  const [, setUser] = useAtom(currentUserAtom);
  const [, setLoading] = useAtom(authLoadingAtom);
  
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await loginAction(email, password);
      setUser(user);
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  return <form onSubmit={...}>...</form>;
}
```

## Auth Provider

The `AuthProvider` checks authentication on app load:

```typescript
// src/components/providers/auth-provider.tsx
"use client";

import { useAtom } from "jotai";
import { currentUserAtom, authLoadingAtom, fetchMeAction } from "@/lib/auth";

export default function AuthProvider({ children }) {
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAuthLoading] = useAtom(authLoadingAtom);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    
    const checkAuth = async () => {
      hasCheckedAuth.current = true;
      setAuthLoading(true);
      try {
        const user = await fetchMeAction();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, [setUser, setAuthLoading]);

  return <>{children}</>;
}
```

## Token Management

Tokens are managed in `@/lib/http/token-manager.ts`:

```typescript
// Access token stored in memory (not localStorage)
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearTokens(): void {
  accessToken = null;
}
```

**Important:** Access tokens are stored in memory for security. Refresh tokens use localStorage as fallback only.

## Atom Naming Conventions

| Pattern | Example | Use |
|---------|---------|-----|
| `*Atom` | `currentUserAtom` | State atoms |
| `*LoadingAtom` | `authLoadingAtom` | Loading states |
| `*Action` | `loginAction` | Async actions |

## When to Use Jotai vs TanStack Query

| Scenario | Use |
|----------|-----|
| API data that needs caching | TanStack Query |
| User session/auth state | Jotai |
| UI preferences (theme, locale) | Jotai |
| Form state | React Hook Form |
| Component-local state | useState |

## Best Practices

1. **Define atoms at module level** - Not inside components
2. **Use "use client"** - Atoms only work in client components
3. **Keep atoms simple** - One piece of state per atom
4. **Use derived atoms** - For computed values
5. **Don't store API data** - Use TanStack Query for that

## Anti-Patterns

```typescript
// ❌ WRONG: Defining atoms inside components
function MyComponent() {
  const myAtom = atom(0);  // Creates new atom on every render
}

// ❌ WRONG: Using atoms for API data
const seriesListAtom = atom<Series[]>([]);  // Use TanStack Query instead

// ❌ WRONG: Complex nested state in atoms
const appStateAtom = atom({
  user: null,
  settings: {},
  cache: {},
});  // Split into separate atoms

// ✅ CORRECT: Separate atoms for each concern
const userAtom = atom<User | null>(null);
const settingsAtom = atom<Settings>({});
```

## Derived Atoms

For computed values:

```typescript
import { atom } from "jotai";

const userAtom = atom<User | null>(null);

// Derived atom - computed from userAtom
const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

// Usage
const [isAuthenticated] = useAtom(isAuthenticatedAtom);
```
