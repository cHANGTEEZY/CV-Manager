"use client"

import { useEffect, useState } from "react"
import { AlertCircle, ArrowLeft, Home,  HomeIcon,  RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface ErrorPageProps {
  code?: number
  title?: string
  message?: string
  showRefresh?: boolean
}

export default function ErrorPage({
  code = 404,
  title = "Page Not Found",
  message = "Sorry, we couldn't find the page you're looking for.",
  showRefresh = true,
}: ErrorPageProps) {
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleRefresh = () => {
    setIsAnimating(true)
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full relative">
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl blur-xl opacity-70 animate-pulse" />

        <div className="bg-card border border-border shadow-lg rounded-xl p-8 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-center text-center">

            <div className="absolute -top-6 -right-6 text-[120px] font-bold text-primary/10 select-none">{code}</div>


            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
              <AlertCircle className="w-10 h-10 text-primary" />
              <span className="absolute w-full h-full rounded-full border-4 border-primary/20 animate-ping opacity-75" />
            </div>


            <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
            <p className="text-muted-foreground mb-8">{message}</p>


            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button  className={cn(
                  "cursor-pointer",
                  "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg",
                  "bg-primary text-secondary-foreground hover:bg-primary/90",
                  "border border-border",
                  "transition-all duration-200 font-medium",
                  "w-full",
                )}>
                <Link to={"/"}>
                <span className="flex gap-2">
                <HomeIcon/>
                Go Home
                </span>
                </Link>
                
              </button>              

              <button
                onClick={() => window.history.back()}
                className={cn(
                  "cursor-pointer",
                  "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/90",
                  "border border-border",
                  "transition-all duration-200 font-medium",
                  "w-full",
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </div>

            {showRefresh && (
              <button
                onClick={handleRefresh}
                className={cn(
                  "mt-4 text-sm text-muted-foreground hover:text-foreground",
                  "flex items-center gap-1.5 transition-all duration-200",
                )}
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isAnimating && "animate-spin")} />
                <span>Refresh the page</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  )
}
