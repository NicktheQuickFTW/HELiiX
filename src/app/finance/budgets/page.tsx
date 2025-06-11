'use client';

import { 
  Background,
  Column,
  Row,
  Grid,
  Card,
  Heading,
  Text,
  Icon,
  Badge,
  StatusIndicator
} from "@once-ui-system/core"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

export default function BudgetsPage() {
  return (
    <Background background="page" fillWidth>
      <Column 
        fillWidth 
        paddingX="xl" 
        paddingY="xl" 
        gap="xl"
        maxWidth="1440"
      >
        <Column gap="m">
          <Row alignItems="center" gap="s">
            <Icon size="xl">
              <DollarSign />
            </Icon>
            <Heading size="xxl" weight="bold">
              Budget Management
            </Heading>
          </Row>
          <Text size="m" onBackground="neutral-weak">
            Monitor and manage conference budgets across all operations
          </Text>
        </Column>
        
        <Grid 
          columns="1" 
          tabletColumns="2" 
          desktopColumns="3" 
          gap="xl"
        >
          <Card padding="xl" border="neutral-medium" radius="l">
            <Column gap="m">
              <Column gap="xs">
                <Heading size="m" weight="semibold">
                  Operations Budget
                </Heading>
                <Text size="s" onBackground="neutral-weak">
                  FY2024-25 Operational Expenses
                </Text>
              </Column>
              
              <Column gap="m">
                <Row justifyContent="space-between" alignItems="center">
                  <Text size="xl" weight="bold">
                    $1.2M
                  </Text>
                  <Badge variant="secondary" size="s">
                    68% Used
                  </Badge>
                </Row>
                
                <StatusIndicator 
                  value={68} 
                  variant="accent" 
                  size="m"
                />
                
                <Row justifyContent="space-between">
                  <Text size="s" onBackground="neutral-weak">
                    $820K spent
                  </Text>
                  <Text size="s" onBackground="neutral-weak">
                    $380K remaining
                  </Text>
                </Row>
              </Column>
            </Column>
          </Card>

          <Card padding="xl" border="neutral-medium" radius="l">
            <Column gap="m">
              <Column gap="xs">
                <Heading size="m" weight="semibold">
                  Championships
                </Heading>
                <Text size="s" onBackground="neutral-weak">
                  Tournament & Championship Events
                </Text>
              </Column>
              
              <Column gap="m">
                <Row justifyContent="space-between" alignItems="center">
                  <Text size="xl" weight="bold">
                    $450K
                  </Text>
                  <Badge variant="danger" size="s">
                    89% Used
                  </Badge>
                </Row>
                
                <StatusIndicator 
                  value={89} 
                  variant="danger" 
                  size="m"
                />
                
                <Row justifyContent="space-between">
                  <Text size="s" onBackground="neutral-weak">
                    $400K spent
                  </Text>
                  <Text size="s" onBackground="neutral-weak">
                    $50K remaining
                  </Text>
                </Row>
              </Column>
            </Column>
          </Card>

          <Card padding="xl" border="neutral-medium" radius="l">
            <Column gap="m">
              <Column gap="xs">
                <Heading size="m" weight="semibold">
                  Technology
                </Heading>
                <Text size="s" onBackground="neutral-weak">
                  HELiiX Platform & Infrastructure
                </Text>
              </Column>
              
              <Column gap="m">
                <Row justifyContent="space-between" alignItems="center">
                  <Text size="xl" weight="bold">
                    $200K
                  </Text>
                  <Badge variant="brand" size="s">
                    45% Used
                  </Badge>
                </Row>
                
                <StatusIndicator 
                  value={45} 
                  variant="brand" 
                  size="m"
                />
                
                <Row justifyContent="space-between">
                  <Text size="s" onBackground="neutral-weak">
                    $90K spent
                  </Text>
                  <Text size="s" onBackground="neutral-weak">
                    $110K remaining
                  </Text>
                </Row>
              </Column>
            </Column>
          </Card>
        </Grid>
      </Column>
    </Background>
  )
}