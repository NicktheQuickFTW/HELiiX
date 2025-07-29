'use client';

import {
  Column,
  Row,
  Icon,
  IconButton,
  Line,
  Tag,
  Text,
  ToggleButton,
} from '@once-ui-system/core';
import { usePathname } from 'next/navigation';

interface Sidebar1Props extends React.ComponentProps<typeof Column> {}

const Sidebar1: React.FC<Sidebar1Props> = ({ ...rest }) => {
  const pathname = usePathname() ?? '';

  return (
    <Column
      maxWidth={16}
      fillHeight
      paddingX="16"
      paddingY="24"
      gap="m"
      background="surface"
      radius="l"
      {...rest}
    >
      <Column fill gap="m">
        <Column fillWidth gap="4">
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            marginBottom="8"
            marginLeft="16"
          >
            Dashboard
          </Text>
          <ToggleButton fillWidth horizontal="start" selected={true}>
            <Row
              padding="4"
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              <Icon name="home" onBackground="neutral-weak" size="xs" />
              Home
            </Row>
          </ToggleButton>
          <ToggleButton
            fillWidth
            horizontal="start"
            selected={pathname === 'analytics'}
          >
            <Row
              padding="4"
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              <Icon name="trend" onBackground="neutral-weak" size="xs" />
              Analytics
            </Row>
          </ToggleButton>
          <ToggleButton
            fillWidth
            horizontal="start"
            selected={pathname === 'reports'}
          >
            <Row
              padding="4"
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              <Icon name="pages" onBackground="neutral-weak" size="xs" />
              Reports
              <Tag variant="neutral" size="s">
                New
              </Tag>
            </Row>
          </ToggleButton>
        </Column>

        <Line />

        <Column fillWidth gap="4">
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            marginY="8"
            marginLeft="16"
          >
            Management
          </Text>
          <ToggleButton
            fillWidth
            horizontal="start"
            selected={pathname === 'users'}
          >
            <Row
              padding="4"
              gap="12"
              vertical="center"
              textVariant="label-default-s"
            >
              <Line width="16" />
              Users
            </Row>
          </ToggleButton>
          <ToggleButton
            fillWidth
            horizontal="start"
            selected={pathname === 'roles'}
          >
            <Row
              padding="4"
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              <Line width="16" />
              Roles
            </Row>
          </ToggleButton>
          <ToggleButton
            fillWidth
            horizontal="start"
            selected={pathname === 'permissions'}
          >
            <Row
              padding="4"
              gap="12"
              vertical="center"
              textVariant="label-default-s"
            >
              <Line width="16" />
              Permissions
            </Row>
          </ToggleButton>
        </Column>

        <Line />

        <Column fill gap="4">
          <Row
            fillWidth
            horizontal="space-between"
            vertical="center"
            paddingY="8"
            paddingX="16"
          >
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Projects
            </Text>
            <IconButton
              tooltip="Create"
              variant="secondary"
              icon="plus"
              size="s"
            />
          </Row>
          <ToggleButton
            fillWidth
            horizontal="start"
            selected={pathname === 'overview'}
          >
            <Row
              padding="4"
              gap="12"
              vertical="center"
              textVariant="label-default-s"
            >
              <Line width="16" />
              Overview
            </Row>
          </ToggleButton>
          <ToggleButton
            fillWidth
            horizontal="start"
            selected={pathname === 'projects'}
          >
            <Row
              padding="4"
              gap="12"
              vertical="center"
              textVariant="label-default-s"
            >
              <Line width="16" />
              My projects
            </Row>
          </ToggleButton>
        </Column>
      </Column>
    </Column>
  );
};

export { Sidebar1 };
