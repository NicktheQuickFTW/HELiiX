'use client'

import { Column, Row, Heading, Text } from "@once-ui-system/core"

export default function ManualsPage() {
  return (
    <Column fillWidth gap="l" padding="xl">
      <Row fillWidth style={{ justifyContent: "center" }}>
        <Column gap="s" style={{ alignItems: "center" }}>
          <Heading variant="display-strong-s">Championship Manuals</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Manual management system coming soon
          </Text>
        </Column>
      </Row>
    </Column>
  )
}