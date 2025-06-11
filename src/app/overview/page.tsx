"use client";

import {
  Background,
  Badge,
  Button,
  Column,
  Flex,
  Heading,
  RevealFx,
  Row,
  Media,
} from "@once-ui-system/core";
import React from "react";
import { SafeFade } from "@/components/ui/safe-ui";

// Hero2 component with fixed DOM property errors
const Hero2 = () => {
  return (
    <Row fillWidth paddingY="xl" gap="128" horizontal="center">
      <Background position="absolute" mask={{ x: 50, y: 100, radius: 75 }} fill vertical="center">
        <Media
          src="/images/backgrounds/2.jpg"
          priority
          sizes="(max-width: 1024px) 80vw, 960px"
          fill
        />
      </Background>
      <Column center zIndex={1} style={{ maxWidth: '40rem' }} gap="24">
        {/* Using SafeFade instead of RevealFx to handle translateY properly */}
        <SafeFade trigger="inView" className="w-full text-center pb-4">
          <Badge
            id="book-now"
            background="overlay"
            border="neutral-alpha-weak"
            href="#"
            onBackground="neutral-strong"
            textVariant="label-default-s"
            effect={false}
          >
            Book your ticket now
          </Badge>
        </SafeFade>
        
        <SafeFade trigger="inView" delay={0.2} translateY="4" className="text-center">
          <Heading variant="display-default-l" style={{ textAlign: 'center' }}>
            Explore a world of possibilities
          </Heading>
        </SafeFade>
        
        <SafeFade trigger="inView" delay={0.4} translateY="12" style={{ marginBottom: '24px' }}>
          <Heading
            wrap="balance"
            variant="heading-default-xl"
            onBackground="neutral-medium"
            style={{ textAlign: 'center' }}
          >
            Travel to destinations around the world and explore the wonders of nature
          </Heading>
        </SafeFade>
        
        <SafeFade trigger="inView" delay={0.6} translateY="16">
          <Flex gap="16" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Button id="download" href="/" size="l">
              Get started
            </Button>
            <Button
              id="viewDemo"
              href="/"
              variant="tertiary"
              weight="default"
              suffixIcon="chevronRight"
              size="l"
            >
              View demo
            </Button>
          </Flex>
        </SafeFade>
      </Column>
    </Row>
  );
};

export { Hero2 };
