"use client"

import { useState } from "react"
// Note: Calendar component needs to be implemented with Once UI or a compatible library

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="px-0">
      <div>
        {/* TODO: Implement calendar with Once UI or compatible library */}
        <div className="p-4 text-sm text-neutral-weak">
          Calendar component needs Once UI implementation
        </div>
      </div>
    </div>
  )
}