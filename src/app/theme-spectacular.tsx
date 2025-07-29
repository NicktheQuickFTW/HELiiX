'use client';

import {
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Background,
  Icon,
  Badge,
  StatusIndicator,
  SegmentedControl,
  Toggle,
  Dropdown,
  Option,
  Line,
  Fade,
  Tag,
  IconButton,
  InlineCode,
  ColorInput,
} from '@once-ui-system/core';
import { useEffect, useState } from 'react';

// Theme Preview Component
const ThemePreview = ({ theme }: { theme: any }) => {
  return (
    <Card
      padding="24"
      radius="l"
      style={{
        background: theme.background,
        border: `1px solid ${theme.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Column gap="20">
        {/* Mini Header */}
        <Row horizontal="space-between" alignItems="center">
          <Row gap="12" alignItems="center">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: theme.brand,
              }}
            />
            <Text variant="label-default-s" style={{ color: theme.text }}>
              {theme.name}
            </Text>
          </Row>
          <Row gap="8">
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: theme.accent,
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: theme.brand,
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: theme.success,
              }}
            />
          </Row>
        </Row>

        {/* Mini Content */}
        <Column gap="12">
          <div
            style={{
              height: '8px',
              width: '60%',
              background: theme.text,
              opacity: 0.8,
              borderRadius: '4px',
            }}
          />
          <div
            style={{
              height: '8px',
              width: '100%',
              background: theme.text,
              opacity: 0.4,
              borderRadius: '4px',
            }}
          />
          <div
            style={{
              height: '8px',
              width: '80%',
              background: theme.text,
              opacity: 0.4,
              borderRadius: '4px',
            }}
          />
        </Column>

        {/* Mini Buttons */}
        <Row gap="8">
          <div
            style={{
              padding: '8px 16px',
              background: theme.brand,
              borderRadius: '6px',
              fontSize: '12px',
              color: 'white',
            }}
          >
            Primary
          </div>
          <div
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '12px',
              color: theme.text,
            }}
          >
            Secondary
          </div>
        </Row>
      </Column>
    </Card>
  );
};

// Color Palette Builder
const ColorPaletteBuilder = () => {
  const [colors, setColors] = useState({
    brand: '#00ff88',
    accent: '#00ffff',
    success: '#00ff00',
    warning: '#ffaa00',
    danger: '#ff0044',
    neutral: '#888888',
  });

  return (
    <Column gap="24">
      <Grid columns="2" gap="16">
        {Object.entries(colors).map(([key, value]) => (
          <Row key={key} gap="12" alignItems="center">
            <div
              style={{
                width: '48px',
                height: '48px',
                background: value,
                borderRadius: '12px',
                border: '1px solid var(--neutral-border-weak)',
              }}
            />
            <Column gap="4" fillWidth>
              <Text
                variant="label-default-s"
                style={{ textTransform: 'capitalize' }}
              >
                {key}
              </Text>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  setColors({ ...colors, [key]: e.target.value })
                }
                style={{
                  background: 'var(--neutral-background-weak)',
                  border: '1px solid var(--neutral-border-weak)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'var(--neutral-on-background-strong)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                }}
              />
            </Column>
          </Row>
        ))}
      </Grid>

      <Button variant="primary" fillWidth>
        Apply Color Palette
      </Button>
    </Column>
  );
};

// Theme Controls
const ThemeControls = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    neutral: 'slate',
    brand: 'green',
    accent: 'aqua',
    solid: 'contrast',
    solidStyle: 'plastic',
    border: 'playful',
    surface: 'translucent',
    transition: 'all',
    scaling: '100',
  });

  const neutralOptions = ['sand', 'gray', 'slate'];
  const colorOptions = [
    'blue',
    'indigo',
    'violet',
    'magenta',
    'pink',
    'red',
    'orange',
    'yellow',
    'moss',
    'green',
    'emerald',
    'aqua',
    'cyan',
  ];
  const solidOptions = ['color', 'contrast'];
  const solidStyleOptions = ['flat', 'plastic'];
  const borderOptions = ['rounded', 'playful', 'conservative'];
  const surfaceOptions = ['filled', 'translucent'];
  const transitionOptions = ['all', 'micro', 'macro'];
  const scalingOptions = ['90', '95', '100', '105', '110'];

  return (
    <Column gap="24">
      {/* Theme Mode */}
      <Row horizontal="space-between" alignItems="center">
        <Column gap="4">
          <Text variant="label-default-m">Theme Mode</Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Switch between light and dark themes
          </Text>
        </Column>
        <SegmentedControl
          size="m"
          value={settings.theme}
          onValueChange={(value) => setSettings({ ...settings, theme: value })}
          buttons={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
        />
      </Row>

      <Line background="neutral-alpha-weak" />

      {/* Color Settings */}
      <Column gap="20">
        <Heading variant="heading-strong-m">Color System</Heading>

        <Column gap="16">
          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">Neutral Palette</Text>
            <Dropdown
              value={settings.neutral}
              onValueChange={(value) =>
                setSettings({ ...settings, neutral: value })
              }
            >
              {neutralOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Row>

          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">Brand Color</Text>
            <Dropdown
              value={settings.brand}
              onValueChange={(value) =>
                setSettings({ ...settings, brand: value })
              }
            >
              {colorOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Row>

          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">Accent Color</Text>
            <Dropdown
              value={settings.accent}
              onValueChange={(value) =>
                setSettings({ ...settings, accent: value })
              }
            >
              {colorOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Row>
        </Column>
      </Column>

      <Line background="neutral-alpha-weak" />

      {/* Style Settings */}
      <Column gap="20">
        <Heading variant="heading-strong-m">Style Options</Heading>

        <Column gap="16">
          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">Solid Style</Text>
            <Row gap="8">
              <Dropdown
                value={settings.solid}
                onValueChange={(value) =>
                  setSettings({ ...settings, solid: value })
                }
              >
                {solidOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Dropdown>
              <Dropdown
                value={settings.solidStyle}
                onValueChange={(value) =>
                  setSettings({ ...settings, solidStyle: value })
                }
              >
                {solidStyleOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Dropdown>
            </Row>
          </Row>

          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">Border Style</Text>
            <Dropdown
              value={settings.border}
              onValueChange={(value) =>
                setSettings({ ...settings, border: value })
              }
            >
              {borderOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Row>

          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">Surface Style</Text>
            <Dropdown
              value={settings.surface}
              onValueChange={(value) =>
                setSettings({ ...settings, surface: value })
              }
            >
              {surfaceOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Row>

          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">Transitions</Text>
            <Dropdown
              value={settings.transition}
              onValueChange={(value) =>
                setSettings({ ...settings, transition: value })
              }
            >
              {transitionOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Row>

          <Row horizontal="space-between" alignItems="center">
            <Text variant="label-default-s">UI Scaling</Text>
            <Dropdown
              value={settings.scaling}
              onValueChange={(value) =>
                setSettings({ ...settings, scaling: value })
              }
            >
              {scalingOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}%
                </Option>
              ))}
            </Dropdown>
          </Row>
        </Column>
      </Column>
    </Column>
  );
};

export default function SpectacularTheme() {
  const presetThemes = [
    {
      name: 'Midnight Green',
      background: '#0a0f0f',
      text: '#e0f2f1',
      border: '#1a3a3a',
      brand: '#00ff88',
      accent: '#00ffff',
      success: '#4ade80',
    },
    {
      name: 'Cyber Purple',
      background: '#0f0a15',
      text: '#e9d5ff',
      border: '#3b2d5a',
      brand: '#a855f7',
      accent: '#e879f9',
      success: '#818cf8',
    },
    {
      name: 'Solar Flare',
      background: '#1a0f0a',
      text: '#fef3c7',
      border: '#451a03',
      brand: '#f59e0b',
      accent: '#ef4444',
      success: '#fbbf24',
    },
    {
      name: 'Ocean Depth',
      background: '#0a0f1a',
      text: '#cffafe',
      border: '#164e63',
      brand: '#06b6d4',
      accent: '#3b82f6',
      success: '#10b981',
    },
  ];

  const [customEffects, setCustomEffects] = useState({
    maskCursor: false,
    gradientDisplay: true,
    dotsDisplay: true,
    linesDisplay: false,
    gridDisplay: true,
  });

  return (
    <>
      <Background
        position="fixed"
        mask={{ cursor: customEffects.maskCursor, radius: 150 }}
        gradient={{ display: customEffects.gradientDisplay, opacity: 30 }}
        dots={{ display: customEffects.dotsDisplay, opacity: 20 }}
        lines={{ display: customEffects.linesDisplay, opacity: 50 }}
        grid={{ display: customEffects.gridDisplay, opacity: 30 }}
      />

      <Column maxWidth="xl" fillWidth gap="40" padding="32">
        {/* Header */}
        <Fade duration="m">
          <Column gap="16" alignItems="center">
            <Badge variant="neutral" size="m">
              <Row gap="8" alignItems="center">
                <Icon name="palette" size="s" />
                <Text variant="label-default-s">Theme System</Text>
              </Row>
            </Badge>

            <Heading
              variant="display-strong-xl"
              align="center"
              style={{
                background:
                  'linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Advanced Theme Control
            </Heading>

            <Text
              variant="display-default-m"
              align="center"
              onBackground="neutral-weak"
              style={{ maxWidth: '600px' }}
            >
              Customize every aspect of the HELiiX platform appearance with our
              comprehensive theming system
            </Text>
          </Column>
        </Fade>

        {/* Preset Themes */}
        <Fade duration="l" delay="s">
          <Column gap="24">
            <Heading variant="display-default-m">Preset Themes</Heading>
            <Grid columns="4" mobileColumns="1" tabletColumns="2" gap="16">
              {presetThemes.map((theme, i) => (
                <Fade key={i} duration="m" delay={`${i * 100}ms` as any}>
                  <ThemePreview theme={theme} />
                </Fade>
              ))}
            </Grid>
          </Column>
        </Fade>

        {/* Theme Builder */}
        <Grid columns="12" mobileColumns="1" tabletColumns="1" gap="32">
          {/* Controls */}
          <Column style={{ gridColumn: 'span 7' }}>
            <Fade duration="l" delay="m">
              <Card
                padding="32"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="24">
                  <Heading variant="display-default-m">
                    Theme Configuration
                  </Heading>
                  <ThemeControls />
                </Column>
              </Card>
            </Fade>
          </Column>

          {/* Color Builder & Effects */}
          <Column style={{ gridColumn: 'span 5' }} gap="24">
            <Fade duration="l" delay="m">
              <Card
                padding="24"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="20">
                  <Heading variant="heading-strong-m">Custom Colors</Heading>
                  <ColorPaletteBuilder />
                </Column>
              </Card>
            </Fade>

            <Fade duration="l" delay="l">
              <Card
                padding="24"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="20">
                  <Heading variant="heading-strong-m">
                    Background Effects
                  </Heading>

                  <Column gap="16">
                    <Row horizontal="space-between" alignItems="center">
                      <Text variant="label-default-s">Cursor Mask</Text>
                      <Toggle
                        selected={customEffects.maskCursor}
                        onToggle={(value) =>
                          setCustomEffects({
                            ...customEffects,
                            maskCursor: value,
                          })
                        }
                      />
                    </Row>
                    <Row horizontal="space-between" alignItems="center">
                      <Text variant="label-default-s">Gradient</Text>
                      <Toggle
                        selected={customEffects.gradientDisplay}
                        onToggle={(value) =>
                          setCustomEffects({
                            ...customEffects,
                            gradientDisplay: value,
                          })
                        }
                      />
                    </Row>
                    <Row horizontal="space-between" alignItems="center">
                      <Text variant="label-default-s">Dots Pattern</Text>
                      <Toggle
                        selected={customEffects.dotsDisplay}
                        onToggle={(value) =>
                          setCustomEffects({
                            ...customEffects,
                            dotsDisplay: value,
                          })
                        }
                      />
                    </Row>
                    <Row horizontal="space-between" alignItems="center">
                      <Text variant="label-default-s">Lines Pattern</Text>
                      <Toggle
                        selected={customEffects.linesDisplay}
                        onToggle={(value) =>
                          setCustomEffects({
                            ...customEffects,
                            linesDisplay: value,
                          })
                        }
                      />
                    </Row>
                    <Row horizontal="space-between" alignItems="center">
                      <Text variant="label-default-s">Grid Pattern</Text>
                      <Toggle
                        selected={customEffects.gridDisplay}
                        onToggle={(value) =>
                          setCustomEffects({
                            ...customEffects,
                            gridDisplay: value,
                          })
                        }
                      />
                    </Row>
                  </Column>

                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Toggle effects to see real-time changes
                  </Text>
                </Column>
              </Card>
            </Fade>
          </Column>
        </Grid>

        {/* Export Section */}
        <Fade duration="xl" delay="xl">
          <Card
            padding="48"
            radius="xl"
            style={{
              background:
                'linear-gradient(135deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background:
                  'radial-gradient(circle, white 0%, transparent 70%)',
                opacity: 0.1,
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />

            <Column
              gap="24"
              alignItems="center"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Icon name="download" size="xl" />
              <Heading variant="display-strong-l" align="center">
                Export Your Theme
              </Heading>
              <Text
                variant="body-default-l"
                align="center"
                style={{ maxWidth: '600px' }}
              >
                Save your custom theme configuration and share it across your
                organization
              </Text>
              <Row gap="16">
                <Button size="l" variant="primary">
                  Export as JSON
                </Button>
                <Button size="l" variant="secondary">
                  Copy CSS Variables
                </Button>
              </Row>
            </Column>
          </Card>
        </Fade>
      </Column>
    </>
  );
}
