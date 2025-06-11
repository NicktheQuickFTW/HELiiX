'use client'

import { Column, Button, Heading, Text } from '@once-ui-system/core'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <Column 
          fillWidth 
          fillHeight 
          justifyContent="center" 
          alignItems="center" 
          gap="l"
          style={{ padding: "var(--spacing-xl)" }}
        >
          <Heading variant="display-strong-l">Something went wrong!</Heading>
          <Text variant="body-default-l" onBackground="neutral-weak">
            An unexpected error occurred. Please try again.
          </Text>
          <Button variant="primary" onClick={() => reset()}>
            Try again
          </Button>
        </Column>
      </body>
    </html>
  )
}