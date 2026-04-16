/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

const BRAND = 'Digital Creatives Hub'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code for {BRAND}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brandName}>{BRAND}</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Confirm your identity</Heading>
        <Text style={text}>Use the code below to verify:</Text>
        <Section style={codeSection}>
          <Text style={codeStyle}>{token}</Text>
        </Section>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can safely ignore this email.
        </Text>
        <Hr style={divider} />
        <Text style={footerBrand}>© {BRAND} — The Future is Built. Not Bought.</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Poppins', 'Montserrat', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '520px', margin: '0 auto' }
const header = { textAlign: 'center' as const, marginBottom: '8px' }
const brandName = { fontSize: '18px', fontWeight: 'bold' as const, color: '#00CED1', letterSpacing: '1px', margin: '0' }
const divider = { borderColor: '#e5e5e5', margin: '20px 0' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#111827', margin: '0 0 16px', fontFamily: "'Montserrat', Arial, sans-serif" }
const text = { fontSize: '15px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 20px' }
const codeSection = { textAlign: 'center' as const, margin: '24px 0' }
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#00CED1',
  letterSpacing: '4px',
  margin: '0',
}
const footer = { fontSize: '13px', color: '#9ca3af', margin: '24px 0 0' }
const footerBrand = { fontSize: '12px', color: '#d1d5db', textAlign: 'center' as const, margin: '8px 0 0' }
