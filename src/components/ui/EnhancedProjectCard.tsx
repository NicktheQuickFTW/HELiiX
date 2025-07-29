'use client';

import {
  AvatarGroup,
  Carousel,
  Column,
  Row,
  Heading,
  SmartLink,
  Text,
} from '@once-ui-system/core';

interface EnhancedProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content?: string;
  description: string;
  avatars: { src: string }[];
  link?: string;
}

export const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
}) => {
  return (
    <Column fillWidth gap="m">
      {images.length > 0 && (
        <Carousel
          sizes="(max-width: 960px) 100vw, 960px"
          items={images.map((image) => ({
            slide: image,
            alt: title,
          }))}
        />
      )}
      <Row
        mobileDirection="column"
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {title && (
          <Row flex={5}>
            <Heading as="h2" wrap="balance" variant="heading-strong-xl">
              {title}
            </Heading>
          </Row>
        )}
        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {avatars?.length > 0 && (
              <AvatarGroup avatars={avatars} size="m" reverse />
            )}
            {description?.trim() && (
              <Text
                wrap="balance"
                variant="body-default-s"
                onBackground="neutral-weak"
              >
                {description}
              </Text>
            )}
            <Row gap="24" wrap>
              {content?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  style={{ margin: '0', width: 'fit-content' }}
                  href={href}
                >
                  <Text variant="body-default-s">View details</Text>
                </SmartLink>
              )}
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: '0', width: 'fit-content' }}
                  href={link}
                >
                  <Text variant="body-default-s">Open project</Text>
                </SmartLink>
              )}
            </Row>
          </Column>
        )}
      </Row>
    </Column>
  );
};
