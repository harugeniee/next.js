# Create Context Provider

Create a React Context Provider with custom hook.

## Arguments
- `$ARGUMENTS`: Provider name (e.g., "Notification" or "Theme")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Provider}` - PascalCase provider name (e.g., "Notification")
- `{provider}` - camelCase (e.g., "notification")

### 1. Create Provider File

File: `src/components/providers/{provider}-provider.tsx`

```typescript
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";

/**
 * {Provider} Context Interface
 * Defines the structure for {provider} state management
 */
interface {Provider}ContextType {
  // State values
  {provider}Value: string;
  is{Provider}Open: boolean;

  // Actions
  set{Provider}Value: (value: string) => void;
  open{Provider}: () => void;
  close{Provider}: () => void;
  toggle{Provider}: () => void;
}

/**
 * {Provider} Context
 * Provides {provider} state management for the application
 */
const {Provider}Context = createContext<{Provider}ContextType | undefined>(undefined);

/**
 * {Provider} Provider Props
 */
interface {Provider}ProviderProps {
  children: ReactNode;
  defaultValue?: string;
}

/**
 * {Provider} Provider Component
 * Manages {provider} state and provides it to child components
 */
export function {Provider}Provider({
  children,
  defaultValue = "",
}: {Provider}ProviderProps) {
  const [{provider}Value, set{Provider}Value] = useState(defaultValue);
  const [is{Provider}Open, setIs{Provider}Open] = useState(false);

  const open{Provider} = useCallback(() => {
    setIs{Provider}Open(true);
  }, []);

  const close{Provider} = useCallback(() => {
    setIs{Provider}Open(false);
  }, []);

  const toggle{Provider} = useCallback(() => {
    setIs{Provider}Open((prev) => !prev);
  }, []);

  const value: {Provider}ContextType = useMemo(
    () => ({
      {provider}Value,
      is{Provider}Open,
      set{Provider}Value,
      open{Provider},
      close{Provider},
      toggle{Provider},
    }),
    [{provider}Value, is{Provider}Open, open{Provider}, close{Provider}, toggle{Provider}]
  );

  return (
    <{Provider}Context.Provider value={value}>
      {children}
    </{Provider}Context.Provider>
  );
}

/**
 * use{Provider} Hook
 * Custom hook to access {provider} context values
 * Provides type-safe access to {provider} state
 *
 * @throws Error if used outside {Provider}Provider
 */
export function use{Provider}() {
  const context = useContext({Provider}Context);

  if (context === undefined) {
    throw new Error("use{Provider} must be used within a {Provider}Provider");
  }

  return context;
}
```

### 2. Update Barrel Export

Add to `src/components/providers/index.ts`:

```typescript
export * from "./{provider}-provider";
```

### 3. Add to Provider Hierarchy (if needed)

Update `src/app/layout.tsx` to include the new provider in the hierarchy:

```typescript
<{Provider}Provider>
  {children}
</{Provider}Provider>
```

## Provider Patterns

### With Jotai Atoms

```typescript
"use client";

import { useAtom } from "jotai";
import { createContext, useContext, useMemo, ReactNode } from "react";
import { {provider}Atom, {provider}LoadingAtom } from "@/lib/stores/{provider}-store";

interface {Provider}ContextType {
  {provider}Value: string;
  isLoading: boolean;
  set{Provider}Value: (value: string) => void;
  setLoading: (loading: boolean) => void;
}

const {Provider}Context = createContext<{Provider}ContextType | undefined>(undefined);

export function {Provider}Provider({ children }: { children: ReactNode }) {
  const [{provider}Value, set{Provider}Value] = useAtom({provider}Atom);
  const [isLoading, setLoading] = useAtom({provider}LoadingAtom);

  const value: {Provider}ContextType = useMemo(
    () => ({
      {provider}Value,
      isLoading,
      set{Provider}Value,
      setLoading,
    }),
    [{provider}Value, isLoading, set{Provider}Value, setLoading]
  );

  return (
    <{Provider}Context.Provider value={value}>
      {children}
    </{Provider}Context.Provider>
  );
}

export function use{Provider}() {
  const context = useContext({Provider}Context);
  if (context === undefined) {
    throw new Error("use{Provider} must be used within a {Provider}Provider");
  }
  return context;
}
```

### With Local Storage Persistence

```typescript
"use client";

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";

const STORAGE_KEY = "{provider}-state";

interface {Provider}ContextType {
  value: string;
  setValue: (value: string) => void;
}

const {Provider}Context = createContext<{Provider}ContextType | undefined>(undefined);

export function {Provider}Provider({ children }: { children: ReactNode }) {
  const [value, setValueState] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setValueState(stored);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  const setValue = (newValue: string) => {
    setValueState(newValue);
    localStorage.setItem(STORAGE_KEY, newValue);
  };

  const contextValue: {Provider}ContextType = useMemo(
    () => ({ value, setValue }),
    [value]
  );

  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <{Provider}Context.Provider value={contextValue}>
      {children}
    </{Provider}Context.Provider>
  );
}

export function use{Provider}() {
  const context = useContext({Provider}Context);
  if (context === undefined) {
    throw new Error("use{Provider} must be used within a {Provider}Provider");
  }
  return context;
}
```

### With Reducer

```typescript
"use client";

import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from "react";

// State type
interface {Provider}State {
  items: string[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type {Provider}Action =
  | { type: "ADD_ITEM"; payload: string }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

// Initial state
const initialState: {Provider}State = {
  items: [],
  isLoading: false,
  error: null,
};

// Reducer
function {provider}Reducer(state: {Provider}State, action: {Provider}Action): {Provider}State {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item !== action.payload) };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Context type
interface {Provider}ContextType {
  state: {Provider}State;
  dispatch: Dispatch<{Provider}Action>;
}

const {Provider}Context = createContext<{Provider}ContextType | undefined>(undefined);

export function {Provider}Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer({provider}Reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <{Provider}Context.Provider value={value}>
      {children}
    </{Provider}Context.Provider>
  );
}

export function use{Provider}() {
  const context = useContext({Provider}Context);
  if (context === undefined) {
    throw new Error("use{Provider} must be used within a {Provider}Provider");
  }
  return context;
}

// Helper hooks for common actions
export function use{Provider}Actions() {
  const { dispatch } = use{Provider}();

  return useMemo(
    () => ({
      addItem: (item: string) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (item: string) => dispatch({ type: "REMOVE_ITEM", payload: item }),
      setLoading: (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }),
      setError: (error: string | null) => dispatch({ type: "SET_ERROR", payload: error }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [dispatch]
  );
}
```

## Reference

- Pattern: `src/components/providers/loading-provider.tsx`
- Pattern: `src/components/providers/auth-provider.tsx`
- Jotai store: `src/lib/auth/auth-store.ts`
- Rule: `.cursor/rules/05-state-jotai.mdc`
