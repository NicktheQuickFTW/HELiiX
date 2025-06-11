"use client"

import { useChat } from '@ai-sdk/react'
import { Button, Input, Card } from "@once-ui-system/core"
import { Bot, Send, Loader2, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai',
  })

  return (
    <div className="fixed bottom-4 right-4">
      <Button variant="secondary" size="l" className="h-12 w-12 rounded-full shadow-lg">
        <Bot className="h-6 w-6" />
      </Button>
      
      {/* Chat interface - you may want to implement this as a modal/overlay */}
      <div className="hidden w-[400px] sm:w-[540px] fixed right-4 bottom-20 bg-background border border-neutral-medium rounded-lg shadow-lg">
        <div className="p-4 border-b border-neutral-medium">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">HELiiX AI Assistant</span>
          </div>
        </div>
        
        <div className="flex flex-col h-[400px] p-4">
          <div className="flex-1 overflow-y-auto pr-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <Card padding="m" border="neutral-medium" background="surface">
                  <p className="text-sm text-neutral-weak">
                    Hi! I'm your AI assistant. I can help you with:
                  </p>
                  <ul className="mt-2 text-sm text-neutral-weak list-disc list-inside space-y-1">
                    <li>Managing awards and inventory</li>
                    <li>Tracking invoices and payments</li>
                    <li>Understanding your analytics</li>
                    <li>Best practices and tips</li>
                  </ul>
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
                  
                  <Card 
                    padding="s" 
                    border="neutral-medium" 
                    background={message.role === 'user' ? 'brand' : 'surface'}
                    className={cn(
                      "max-w-[80%]",
                      message.role === 'user' ? 'text-brand-on-background' : ''
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                  <Card padding="s" border="neutral-medium" background="surface">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Card>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button variant="primary" size="s" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}