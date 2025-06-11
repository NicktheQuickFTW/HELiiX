"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { Background, ToastProvider } from "@once-ui-system/core"
import { Toast } from "@once-ui-system/core"
import { AuthProvider } from "@/lib/auth-context"

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        storageKey="heliix-theme"
      >
        <ToastProvider>
          <AuthProvider>
            <Background background="page" fillWidth>
              {children}
            </Background>
          </AuthProvider>
        </ToastProvider>
        <Toast />
      </ThemeProvider>
    </QueryClientProvider>
  )
}