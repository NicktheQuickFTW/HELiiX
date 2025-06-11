'use client'

import { useEffect } from 'react'
import { Column, Button, Heading, Text } from '@once-ui-system/core'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Column fillWidth fillHeight style={{ justifyContent: "center", alignItems: "center" }}>
      <Column gap="m" style={{ alignItems: "center" }}>
        <Heading variant="display-strong-l">Error</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          An error occurred while loading this page.
        </Text>
        <Button variant="primary" size="m" onClick={() => reset()}>
          Try again
        </Button>
      </Column>
    </Column>
  )
}