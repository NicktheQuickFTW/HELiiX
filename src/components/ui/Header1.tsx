'use client';

import React from 'react';
import {
  Background,
  Column,
  Grid,
  Heading,
  Icon,
  Row,
  Text,
} from '@once-ui-system/core';

const features = [
  {
    title: 'Component Library',
    description:
      'Extensive collection of customizable UI components built with modern best practices and accessibility in mind.',
    icon: 'refresh',
  },
  {
    title: 'Design Tokens',
    description:
      'Centralized design tokens for colors, typography, spacing, and more to maintain consistent styling across your application.',
    icon: 'refresh',
  },
  {
    title: 'Responsive Design',
    description:
      'Fluid and adaptive layouts that work seamlessly across all devices and screen sizes.',
    icon: 'refresh',
  },
  {
    title: 'Dark Mode',
    description:
      'Built-in dark mode support with smooth transitions and customizable color schemes.',
    icon: 'refresh',
  },
  {
    title: 'Accessibility',
    description:
      'WCAG compliant components with keyboard navigation, screen reader support, and proper ARIA attributes.',
    icon: 'refresh',
  },
  {
    title: 'Documentation',
    description:
      'Comprehensive documentation with live examples, code snippets, and best practices for implementation.',
    icon: 'refresh',
  },
];

interface Header1Props {
  authenticated?: boolean;
  avatar?: string;
}

export const Header1: React.FC<Header1Props> = ({
  authenticated = false,
  avatar = '/images/creators/lorant.jpg',
}) => {
  return (
    <Column fillWidth horizontal="center" borderTop="neutral-medium">
      <Row
        fillWidth
        horizontal="center"
        borderLeft="neutral-medium"
        borderRight="neutral-medium"
      >
        <Background
          fill={false}
          fillWidth
          hide="s"
          borderRight="neutral-medium"
          mask={{ x: 100, y: 50, radius: 50 }}
          lines={{
            display: true,
            size: '8',
            angle: -45,
            thickness: 1,
            color: 'neutral-border-medium',
          }}
        />
        <Column fillWidth>
          <Column fillWidth horizontal="center" padding="32">
            <Heading
              as="h2"
              variant="heading-strong-l"
              align="center"
              marginBottom="8"
            >
              Next-Gen Features
            </Heading>
            <Text
              align="center"
              onBackground="neutral-strong"
              variant="body-default-s"
            >
              Empowering developers with cutting-edge tools and capabilities
            </Text>
          </Column>
        </Column>
        <Background
          fill={false}
          fillWidth
          hide="s"
          borderLeft="neutral-medium"
          mask={{ x: 0, y: 50, radius: 50 }}
          lines={{
            display: true,
            size: '8',
            angle: 45,
            thickness: 1,
            color: 'neutral-border-medium',
          }}
        />
      </Row>
      <Grid
        borderLeft="neutral-medium"
        borderTop="neutral-medium"
        columns="3"
        tabletColumns="2"
        mobileColumns="1"
      >
        {features.map((feature, index) => (
          <Column
            padding="40"
            borderBottom="neutral-medium"
            borderRight="neutral-medium"
            key={index}
            fillWidth
            gap="8"
          >
            <Icon name={feature.icon} size="s" onBackground="brand-weak" />
            <Heading marginTop="12" as="h3" variant="body-default-m">
              {feature.title}
            </Heading>
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="body-default-s"
            >
              {feature.description}
            </Text>
          </Column>
        ))}
      </Grid>
    </Column>
  );
};
