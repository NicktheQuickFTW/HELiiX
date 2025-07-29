'use client';

import React from 'react';
import {
  Button,
  Input,
  Logo,
  Background,
  Column,
  PasswordInput,
  Row,
  Line,
  SmartLink,
  Heading,
  Media,
  Fade,
} from '@once-ui-system/core';

const Login1 = () => {
  return (
    <Row background="page" fill>
      <Background
        mask={{
          x: 100,
          y: 0,
          radius: 75,
        }}
        position="absolute"
        grid={{
          display: true,
          opacity: 50,
          width: '0.5%',
          color: 'neutral-alpha-medium',
          height: '1rem',
        }}
      />
      <Row hide="m" fill maxWidth={40} padding="8">
        <Row fill radius="m" overflow="hidden">
          <Media
            position="absolute"
            fill
            src="/images/backgrounds/2.jpg"
            alt="Preview image"
            sizes="560px"
          />
          <Fade
            pattern={{ display: true, size: '2' }}
            position="absolute"
            bottom="0"
            to="top"
            height={24}
            fillWidth
          />
          <Column fill padding="48" vertical="end" zIndex={2}>
            <Heading as="h2" variant="display-default-m">
              Explore what nature has to offer
            </Heading>
          </Column>
        </Row>
      </Row>
      <Column fill center>
        <Column fillWidth center gap="16" padding="32" maxWidth={32}>
          <Logo icon="/trademark/icon-dark.svg" size="l" />
          <Heading variant="display-strong-xs" align="center">
            Welcome to Once UI
          </Heading>
          <Row onBackground="neutral-medium" marginBottom="24" align="center">
            Log in or
            <SmartLink href=" ">sign up</SmartLink>
          </Row>
          <Column fillWidth gap="8">
            <Button
              label="Continue with Google"
              fillWidth
              variant="secondary"
              weight="default"
              prefixIcon="google"
              size="l"
            />
            <Button
              label="Continue with GitHub"
              fillWidth
              variant="secondary"
              weight="default"
              prefixIcon="github"
              size="l"
            />
          </Column>
          <Row fillWidth paddingY="24">
            <Row
              onBackground="neutral-weak"
              fillWidth
              gap="24"
              vertical="center"
            >
              <Line />/<Line />
            </Row>
          </Row>
          <Column gap="-1" fillWidth>
            <Input id="email" placeholder="Email" radius="top" />
            <PasswordInput
              id="password"
              placeholder="Password"
              radius="bottom"
            />
          </Column>
          <Button id="login" label="Log in" arrowIcon fillWidth />
        </Column>
      </Column>
    </Row>
  );
};

export { Login1 };
