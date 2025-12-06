"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { DerivAPIClient } from "./deriv-api"
import { DERIV_CONFIG } from "./deriv-config"
import { useDerivAuth } from "@/hooks/use-deriv-auth"

interface DerivAPIContextType {
  apiClient: DerivAPIClient | null
  isConnected: boolean
  isAuthorized: boolean
  error: string | null
  connectionStatus: "disconnected" | "connecting" | "connected" | "reconnecting"
}

const DerivAPIContext = createContext<DerivAPIContextType>({
  apiClient: null,
  isConnected: false,
  isAuthorized: false,
  error: null,
  connectionStatus: "disconnected",
})

let globalAPIClient: DerivAPIClient | null = null

export function DerivAPIProvider({ children }: { children: React.ReactNode }) {
  const [apiClient, setApiClient] = useState<DerivAPIClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "reconnecting"
  >("disconnected")
  const initAttemptRef = useRef(0)
  const isConnectingRef = useRef(false)
  const { token, isLoggedIn } = useDerivAuth()

  useEffect(() => {
    if (isConnectingRef.current) {
      return
    }

    if (globalAPIClient && globalAPIClient.isConnected()) {
      setApiClient(globalAPIClient)
      setIsConnected(true)
      setIsAuthorized(true)
      setConnectionStatus("connected")
      return
    }

    const attemptConnection = async () => {
      if (isConnectingRef.current) return
      isConnectingRef.current = true

      try {
        initAttemptRef.current++
        setConnectionStatus("connecting")
        setError(null)

        if (globalAPIClient) {
          try {
            globalAPIClient.disconnect()
          } catch (e) {
            // Ignore cleanup errors
          }
          globalAPIClient = null
        }

        globalAPIClient = new DerivAPIClient({ appId: DERIV_CONFIG.APP_ID })

        globalAPIClient.setErrorCallback((err) => {
          console.error("[v0] API Error:", err)
          setError(err.message || "API Error")
        })

        await globalAPIClient.connect()

        setApiClient(globalAPIClient)
        setIsConnected(true)
        setIsAuthorized(true)
        setConnectionStatus("connected")
        setError(null)
        initAttemptRef.current = 0
        isConnectingRef.current = false
      } catch (err: any) {
        console.error("[v0] Connection failed:", err)
        isConnectingRef.current = false

        if (initAttemptRef.current < 5) {
          setConnectionStatus("reconnecting")
          const delay = Math.min(1000 * Math.pow(1.5, initAttemptRef.current), 10000)
          setTimeout(attemptConnection, delay)
        } else {
          console.error("[v0] Max connection attempts reached")
          setError("Failed to connect to API. Please check your connection and try again.")
          setConnectionStatus("disconnected")
          setIsConnected(false)
          setIsAuthorized(false)
        }
      }
    }

    attemptConnection()

    const interval = setInterval(() => {
      if (globalAPIClient) {
        const connected = globalAPIClient.isConnected()
        const authorized = connected

        if (connected !== isConnected) setIsConnected(connected)
        if (authorized !== isAuthorized) setIsAuthorized(authorized)

        if (connected && authorized) {
          if (connectionStatus !== "connected") {
            setConnectionStatus("connected")
            setError(null)
          }
        } else if (!connected && connectionStatus === "connected") {
          setConnectionStatus("disconnected")
        }
      }
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <DerivAPIContext.Provider
      value={{
        apiClient,
        isConnected,
        isAuthorized,
        error,
        connectionStatus,
      }}
    >
      {children}
    </DerivAPIContext.Provider>
  )
}

export function useDerivAPI() {
  const context = useContext(DerivAPIContext)
  if (!context) {
    throw new Error("useDerivAPI must be used within DerivAPIProvider")
  }
  return context
}
