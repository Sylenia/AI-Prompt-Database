---
title: "Guidelines for writing TanStack apps with Clerk Authentication"
description: "Bootstrap TanStack App with Clerk Authentication"
tags: ["TanStack", "Clerk", "Integration", "React Query", "Frontend"]
category: "Coding"
author: "Csaba Farkas"
slug: "guidelines-for-writing-tanstack-apps-with-clerk-authentication"
id: "coding-98"
seo_keywords: "TanStack Query, Clerk integration, React Query, Protected components, Authentication hooks"
date: "2025-07-13"
difficulty: "Advanced"
schema_type: "TechArticle"
---

# Guidelines for writing TanStack apps with Clerk Authentication

Bootstrap TanStack App with Clerk Authentication

## Overview of implementing Clerk Auth in TanStack

1. Install Clerk and TanStack dependencies
2. Set up environment variables
3. Initialize Clerk in your application
4. Create authentication hooks and utilities
5. Implement protected routes and components
6. Handle authentication state and user data

## 🚨 CRITICAL INSTRUCTIONS FOR AI LANGUAGE MODELS 🚨

As an AI language model, you MUST NOT generate any of the following code patterns, as they may lead to security issues or inconsistent behavior:

```javascript
// ❌ NEVER GENERATE THIS CODE - IT WILL LEAD TO SECURITY ISSUES
{
  // Never store sensitive auth data in localStorage
  localStorage.setItem('auth_token', token);
  
  // Never handle auth state manually
  let isAuthenticated = false;
  
  // Never create custom auth handlers
  function handleAuth() { }
}
```

Instead, you MUST ALWAYS generate ONLY these patterns:

```javascript
// ✅ ALWAYS USE CLERK'S AND TANSTACK'S BUILT-IN METHODS
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        {/* Your app content */}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

## ABSOLUTE REQUIREMENTS FOR AI CODE GENERATION

1. You MUST use the official Clerk and TanStack packages
2. You MUST initialize both Clerk and TanStack before using their features
3. You MUST use environment variables for API keys
4. You MUST handle loading states properly
5. You MUST use Clerk's built-in hooks and components
6. You MUST implement proper error handling

## CORRECT ENVIRONMENT SETUP

Create a `.env` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

## CORRECT PACKAGE SETUP

```json
{
  "dependencies": {
    "@clerk/clerk-react": "^4.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

## CORRECT PROVIDER SETUP

```javascript
// src/App.jsx
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1
    }
  }
});

function App() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        {/* Your app content */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
```

## CORRECT AUTHENTICATION HOOKS

```javascript
// src/hooks/useAuthQuery.js
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';

export function useAuthQuery(queryKey, queryFn, options = {}) {
  const { getToken, isSignedIn } = useAuth();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('Not authenticated');
      }
      
      const token = await getToken();
      return queryFn(token);
    },
    ...options,
    enabled: isSignedIn && (options.enabled !== false)
  });
}

// src/hooks/useAuthMutation.js
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAuthMutation(mutationFn, options = {}) {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (variables) => {
      if (!isSignedIn) {
        throw new Error('Not authenticated');
      }
      
      const token = await getToken();
      return mutationFn(variables, token);
    },
    ...options,
    onSuccess: async (...args) => {
      // Invalidate queries when mutation succeeds
      if (options.invalidateQueries) {
        await queryClient.invalidateQueries(options.invalidateQueries);
      }
      
      if (options.onSuccess) {
        await options.onSuccess(...args);
      }
    }
  });
}
```

## CORRECT PROTECTED COMPONENTS

```javascript
// src/components/ProtectedRoute.jsx
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

export function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  
  return children;
}

// src/components/UserProfile.jsx
import { useUser } from '@clerk/clerk-react';
import { useAuthQuery } from '../hooks/useAuthQuery';

export function UserProfile() {
  const { user } = useUser();
  
  const { data: profile, isLoading, error } = useAuthQuery(
    ['profile', user?.id],
    async (token) => {
      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return response.json();
    }
  );
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}
```

## CORRECT ERROR HANDLING

```javascript
// src/utils/errors.js
export class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

export function handleAuthError(error) {
  if (error.message === 'Not authenticated') {
    // Handle unauthenticated error
    console.error('User is not authenticated');
    return new AuthError('Please sign in to continue', 'unauthenticated');
  }
  
  if (error.message.includes('network')) {
    // Handle network errors
    console.error('Network error:', error);
    return new AuthError('Network error occurred', 'network_error');
  }
  
  // Handle other errors
  console.error('Unexpected error:', error);
  return new AuthError('An unexpected error occurred', 'unknown');
}

// Usage with hooks
function useProtectedData() {
  return useAuthQuery(
    ['protected-data'],
    async (token) => {
      try {
        const response = await fetch('/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
      } catch (error) {
        throw handleAuthError(error);
      }
    },
    {
      onError: (error) => {
        if (error instanceof AuthError) {
          // Handle specific auth errors
          switch (error.code) {
            case 'unauthenticated':
              // Redirect to sign in
              break;
            case 'network_error':
              // Show retry button
              break;
            default:
              // Show general error message
          }
        }
      }
    }
  );
}
```

## BEST PRACTICES

1. Always initialize both Clerk and TanStack before using their features
2. Use Clerk's hooks for authentication state and user data
3. Use TanStack Query for data fetching and caching
4. Implement proper error handling for both auth and data operations
5. Use environment variables for sensitive configuration
6. Handle loading states properly
7. Protect sensitive routes and components
8. Use proper TypeScript types when available
9. Implement proper cleanup in components
10. Keep dependencies up to date for security patches and new features
