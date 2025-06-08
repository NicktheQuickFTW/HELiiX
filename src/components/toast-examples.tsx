"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, X, AlertCircle, Info } from "lucide-react"

export function ToastExamples() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Award created successfully", {
            description: "The award has been added to your inventory",
            action: {
              label: "View",
              onClick: () => console.log("View award"),
            },
          })
        }
      >
        <Check className="mr-2 h-4 w-4" />
        Success Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.error("Failed to save invoice", {
            description: "Please check your connection and try again",
            action: {
              label: "Retry",
              onClick: () => console.log("Retry"),
            },
          })
        }
      >
        <X className="mr-2 h-4 w-4" />
        Error Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Duplicate invoice number", {
            description: "This invoice number already exists",
          })
        }
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        Warning Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.info("Sync in progress", {
            description: "Your data is being synchronized",
          })
        }
      >
        <Info className="mr-2 h-4 w-4" />
        Info Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          const promise = new Promise((resolve) => {
            setTimeout(resolve, 3000)
          })

          toast.promise(promise, {
            loading: "Uploading document...",
            success: "Document uploaded successfully",
            error: "Failed to upload document",
          })
        }}
      >
        Promise Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast("Custom styled toast", {
            description: "This is a custom styled toast",
            style: {
              background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
              color: "white",
            },
          })
        }
      >
        Custom Style
      </Button>
    </div>
  )
}