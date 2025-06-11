'use client'

import {
  Background,
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Badge,
  Icon
} from '@once-ui-system/core'
import { SyncStatusDashboard } from '@/components/business/SyncStatusDashboard'
import Link from "next/link"
import { 
  ArrowLeft, 
  Database, 
  RefreshCw, 
  FileText,
  ExternalLink,
  Info
} from "lucide-react"

export default function SyncPage() {
  return (
    <Background background="page" fillWidth>
      <Column padding="l" gap="l" fillWidth>
        {/* Back Navigation */}
        <Row>
          <Link href="/analytics">
            <Button variant="ghost" size="s">
              <Icon name="arrowLeft" size="s" />
              Back to Analytics
            </Button>
          </Link>
        </Row>

        {/* Header */}
        <Column gap="m">
          <Row style={{ alignItems: "center" }} gap="m">
            <div style={{ 
              width: '4rem', 
              height: '4rem', 
              borderRadius: '0.5rem', 
              backgroundColor: 'var(--accent-surface)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Icon name="refreshCw" size="l" />
            </div>
            <Column gap="xs">
              <Heading as="h1" size="xl">Data Synchronization</Heading>
              <Text size="l" color="neutral-500">
                Monitor and manage data sync between Notion and Supabase databases for real-time contact management.
              </Text>
            </Column>
          </Row>
          
          <Row gap="s" wrap>
            <Badge variant="neutral">Real-time Sync</Badge>
            <Badge variant="neutral">Notion Integration</Badge>
            <Badge variant="neutral">Supabase Database</Badge>
            <Badge variant="accent">Automated</Badge>
          </Row>
        </Column>

        {/* Information Cards */}
        <Grid columns={2} gap="m" fillWidth>
          <Card padding="m">
            <Column gap="m">
              <Row style={{ alignItems: "center" }} gap="s">
                <Icon name="database" size="m" color="accent" />
                <Heading as="h3" size="m">About Data Sync</Heading>
              </Row>
              
              <Column gap="s">
                <Text size="s" color="neutral-600">
                  The sync system automatically transfers contact data from your Notion database to Supabase, 
                  enabling faster queries and better performance for the HELiiX platform.
                </Text>
                
                <Column gap="xs">
                  <Row style={{ alignItems: "center" }} gap="s">
                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--success-text)' }} />
                    <Text size="s">Automated incremental updates</Text>
                  </Row>
                  <Row style={{ alignItems: "center" }} gap="s">
                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--success-text)' }} />
                    <Text size="s">Real-time contact directory</Text>
                  </Row>
                  <Row style={{ alignItems: "center" }} gap="s">
                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--success-text)' }} />
                    <Text size="s">Sport-specific filtering</Text>
                  </Row>
                  <Row style={{ alignItems: "center" }} gap="s">
                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--success-text)' }} />
                    <Text size="s">Comprehensive sync logging</Text>
                  </Row>
                </Column>
              </Column>
            </Column>
          </Card>

          <Card padding="m">
            <Column gap="m">
              <Row style={{ alignItems: "center" }} gap="s">
                <Icon name="info" size="m" color="accent" />
                <Heading as="h3" size="m">Quick Actions</Heading>
              </Row>
              
              <Column gap="s">
                <Link href="/contacts">
                  <Button variant="primary" size="m" fillWidth>
                    <Icon name="database" size="s" />
                    View Contacts Directory
                  </Button>
                </Link>
                
                <a 
                  href="https://www.notion.so/13779839c200819db58bd3f239672f9a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="secondary" size="m" fillWidth>
                    <Icon name="externalLink" size="s" />
                    Open Notion Database
                  </Button>
                </a>
                
                <Link href="/analytics">
                  <Button variant="secondary" size="m" fillWidth>
                    <Icon name="fileText" size="s" />
                    View Analytics Dashboard
                  </Button>
                </Link>
              </Column>
            </Column>
          </Card>
        </Grid>

        {/* Main Sync Dashboard */}
        <SyncStatusDashboard />
      </Column>
    </Background>
  )
}