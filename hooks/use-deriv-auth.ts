"use client"

/**
 * Mock Deriv Auth Hook
 * Created mock hook to replace @deriv/deriv-api authentication
 * Provides hardcoded demo values to bypass login while maintaining app functionality
 */

export interface Account {
  loginid: string
  token: string
  currency: string
  balance: number
}

export interface Balance {
  amount: number
  currency: string
}

export function useDerivAuth() {
  return {
    token: "demo_token_bypass", // Mock token for API connection
    isLoggedIn: true, // Always logged in
    balance: {
      amount: 10000,
      currency: "USD",
    } as Balance,
    accounts: [
      {
        loginid: "VRTC12345",
        token: "demo_token_bypass",
        currency: "USD",
        balance: 10000,
      },
    ] as Account[],
    activeLoginId: "VRTC12345",
    accountType: "DEMO",
    accountCode: "DEMO",
  }
}
