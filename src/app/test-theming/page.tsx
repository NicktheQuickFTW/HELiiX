"use client";

import { 
  Column, 
  Row, 
  Card, 
  Button, 
  Heading, 
  Text, 
  Badge 
} from "@once-ui-system/core";

export default function TestTheming() {
  return (
    <Column fillWidth center padding="xl" gap="l">
      <Heading variant="display-strong-xl">HELiiX Theme Test</Heading>
      
      <Row gap="m" wrap>
        <Card padding="l" maxWidth="sm">
          <Column gap="m">
            <Heading variant="heading-strong-l">Brand Colors</Heading>
            <Row gap="s" wrap>
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
            </Row>
            <Row gap="s" wrap>
              <Badge variant="brand">Brand Badge</Badge>
              <Badge variant="accent">Accent Badge</Badge>
              <Badge variant="neutral">Neutral Badge</Badge>
            </Row>
          </Column>
        </Card>

        <Card padding="l" maxWidth="sm">
          <Column gap="m">
            <Heading variant="heading-strong-l">Big 12 Elements</Heading>
            <Text variant="body-default-m">
              This should show the blue brand colors and proper theming 
              configured for the Big 12 Conference HELiiX platform.
            </Text>
            <Button variant="brand" size="l">
              Big 12 Action
            </Button>
          </Column>
        </Card>
      </Row>
    </Column>
  );
}