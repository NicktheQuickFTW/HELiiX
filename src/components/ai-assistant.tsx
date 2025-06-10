"use client"

import { useChat } from '@ai-sdk/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bot, Send, Loader2, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai',
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg">
          <Bot className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            HELiiX AI Assistant
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-8rem)] mt-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Hi! I'm your AI assistant. I can help you with:
                    </p>
                    <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Managing awards and inventory</li>
                      <li>Tracking invoices and payments</li>
                      <li>Understanding your analytics</li>
                      <li>Best practices and tips</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  
                  <Card className={cn(
                    "max-w-[80%]",
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : ''
                  )}>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                  
                  {message.role === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <Card>
                    <CardContent className="p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} size="icon">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}