"use client"

import { Column, Row, Text, Button } from "@once-ui-system/core"

export default function TestSimplePage() {
  return (
    <Column fillWidth padding="l" gap="m">
      <Text variant="heading-strong-xl">Test Page</Text>
      <Row gap="m">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </Row>
      <Text>This is a simple test to see if Once UI components render properly.</Text>
    </Column>
  )
}