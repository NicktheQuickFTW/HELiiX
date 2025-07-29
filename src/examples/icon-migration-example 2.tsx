import React from 'react';
import EnhancedIcon, { IconDebug } from '@/components/ui/enhanced-icon';
import { Column, Row, Text } from '@once-ui-system/core';

/**
 * Example component showing how to use the EnhancedIcon component
 * during the UI framework migration from shadcn/ui to Once UI System
 */
export const IconMigrationExample = () => {
  return (
    <Column gap="24" paddingY="32" paddingX="24">
      <Text variant="heading-default-l">Icon Migration Examples</Text>
      
      {/* Navigation icons */}
      <Row gap="16">
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="arrowRight" size="m" />
          <Text variant="label-default-s">arrowRight → chevronRight</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="arrowLeft" size="m" />
          <Text variant="label-default-s">arrowLeft → chevronLeft</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="chevronRight" size="m" />
          <Text variant="label-default-s">chevronRight (native)</Text>
        </Column>
      </Row>
      
      {/* Status icons */}
      <Row gap="16">
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="info" size="m" onBackground="info-medium" />
          <Text variant="label-default-s">info (native)</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="warning" size="m" onBackground="warning-medium" />
          <Text variant="label-default-s">warning (native)</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="danger" size="m" onBackground="danger-medium" />
          <Text variant="label-default-s">danger (native)</Text>
        </Column>
      </Row>
      
      {/* Icons that need mapping */}
      <Row gap="16">
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="globe" size="m" />
          <Text variant="label-default-s">globe → info</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="magic" size="m" />
          <Text variant="label-default-s">magic → rocket</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="shield" size="m" />
          <Text variant="label-default-s">shield → info</Text>
        </Column>
      </Row>
      
      {/* Context-aware examples */}
      <Row gap="16">
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="zap" size="m" context="performance" />
          <Text variant="label-default-s">zap (performance)</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="activity" size="m" context="status" />
          <Text variant="label-default-s">activity (status)</Text>
        </Column>
        <Column gap="8" alignItems="center">
          <EnhancedIcon name="users" size="m" fallback="user" />
          <Text variant="label-default-s">users (custom fallback)</Text>
        </Column>
      </Row>
      
      <Text variant="heading-default-m">Development Debugging</Text>
      <Row gap="16">
        <Column gap="8" alignItems="center">
          <div>
            <EnhancedIcon name="globe" size="m" />
            <IconDebug name="globe" />
          </div>
        </Column>
        <Column gap="8" alignItems="center">
          <div>
            <EnhancedIcon name="brain" size="m" />
            <IconDebug name="brain" />
          </div>
        </Column>
      </Row>
    </Column>
  );
};

export default IconMigrationExample;
