import { LoginForm } from "@/components/forms/LoginForm"
import { Column, Row, Background, Card, Heading, Text } from "@once-ui-system/core"

export default function LoginPage() {
  return (
    <Background background="page" fillWidth>
      <div className="login-container">
        {/* Left side brand panel - hidden on mobile */}
        <Card
          background="neutral-strong"
          className="login-brand-panel"
        >
          <Row align="center" gap="8" style={{ fontSize: "1.125rem", fontWeight: "500" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "24px", height: "24px" }}
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            HELiiX
          </Row>
          <Column gap="8" style={{ marginTop: "auto" }}>
            <Text variant="body-default-l" onBackground="white">
              &ldquo;HELiiX has transformed how we manage logistics and operations across all Big 12 Conference sports.&rdquo;
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Big 12 Operations Team
            </Text>
          </Column>
        </Card>
        
        {/* Right side login form */}
        <Column
          align="center"
          justify="center"
          className="login-form-container"
        >
          <Column
            gap="24"
            align="center"
            className="login-form-content"
          >
            <Column gap="8" align="center">
              <Heading variant="heading-strong-l">
                Sign in to your account
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak" align="center">
                Enter your email and password below to access HELiiX
              </Text>
            </Column>
            
            <LoginForm />
            
            <Text variant="body-default-s" onBackground="neutral-weak" align="center" className="login-terms">
              By clicking continue, you agree to our{" "}
              <a href="/terms" className="login-link">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="login-link">
                Privacy Policy
              </a>
              .
            </Text>
          </Column>
        </Column>
      </div>
    </Background>
  )
}