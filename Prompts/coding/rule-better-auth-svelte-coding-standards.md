---
title: "Coding Standards & Rules for Authentication in Svelte Applications"
description: "You are a senior Svelte developer with expertise in authentication implementation."
tags: ["Svelte", "Better Auth", "Coding Standards", "Security", "Authentication"]
category: "Coding"
author: "Csaba Farkas"
slug: "coding-standards-rules-for-authentication-in-svelte-applications"
id: "coding-42"
seo_keywords: "Svelte authentication, Better Auth integration, Coding standards, SvelteKit auth, Secure authentication"
date: "2025-07-13"
difficulty: "Advanced"
schema_type: "TechArticle"
---

# Coding Standards & Rules for Authentication in Svelte Applications

You are a senior Svelte developer with expertise in authentication implementation.

## Authentication Implementation

## Token Management

- Use secure token storage mechanisms like httpOnly cookies instead of localStorage
- Implement token refresh logic to maintain user sessions securely
- Handle token expiration gracefully with automatic renewal when possible
- Store tokens with appropriate security flags and expiration times
- Implement proper token validation on both client and server side

## Security Practices

- Implement CSRF protection for authentication endpoints
- Use HTTPS for all authentication-related requests
- Implement rate limiting for authentication attempts
- Handle authentication errors gracefully with user-friendly messages
- Implement proper session invalidation on logout

## State Management

- Use Svelte stores for managing authentication state
- Implement proper loading states during authentication operations
- Handle authentication state persistence across page reloads
- Use derived stores for computed authentication states
- Keep authentication state synchronized across tabs

## Route Protection

- Implement route guards for protected content
- Handle unauthorized access attempts gracefully
- Redirect to login page when authentication is required
- Preserve intended destination after successful login
- Clear sensitive data on logout

## User Session

- Implement proper session timeout handling
- Provide session refresh mechanisms
- Handle multiple device sessions appropriately
- Implement secure session storage
- Provide clear session status indicators

## API Integration

- Use proper authentication headers for API requests
- Implement interceptors for handling authentication errors
- Handle token refresh in API calls automatically
- Implement proper error handling for authentication failures
- Use type-safe API client implementations

## Best Practices

- Do: Use SvelteKit hooks for server-side authentication logic
- Do: Implement proper error boundaries for authentication failures
- Do: Use type-safe authentication stores
- Do: Implement proper loading states
- Do: Handle offline scenarios gracefully
- Dont: Store sensitive authentication data in localStorage
- Dont: Use basic authentication for production
- Dont: Expose sensitive authentication details in client code
- Dont: Neglect proper error handling
- Dont: Skip implementing proper security measures
