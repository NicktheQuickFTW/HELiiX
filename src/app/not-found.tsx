import Link from 'next/link'
import { Column, Row, Button, Heading, Text } from '@once-ui-system/core'

export default function NotFound() {
  return (
    <Column fillWidth fillHeight style={{ justifyContent: "center", alignItems: "center" }}>
      <Column gap="m" style={{ alignItems: "center" }}>
        <Heading variant="display-strong-l">404</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          The page you are looking for doesn't exist.
        </Text>
        <Link href="/">
          <Button variant="primary" size="m">
            Return Home
          </Button>
        </Link>
      </Column>
    </Column>
  )
}