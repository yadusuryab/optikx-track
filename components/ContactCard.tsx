/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// ─────────────────────────────────────────────────────────────
//  ContactCard.jsx
//  Drop anywhere in your homepage. Update CONTACT below.
// ─────────────────────────────────────────────────────────────

const CONTACT = {
  brandName: "OPTIKX",
  brandSub: "Official Store",
  instagram: {
    handle: "@optikx.in",
    url: "https://instagram.com/optikx.in",
  },
  email: {
    label: "Mail",
    address: "hello.optikx@gmail.com",
  },
  phones: [
    { label: "Contact 1",   number: "+91 9074717848", href: "tel:+919074717848" },
    { label: "Contact 2",   number: "+91 9947120601", href: "tel:+919947120601" },
    { label: "Contact 3",  number: "+91 7356706721", href: "tel:+917356706721" },
  ],
};

// ─── Icons ────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const InstaIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10"/>
  </svg>
);

// ─── Row ──────────────────────────────────────────────────────
function Row({ href, icon, label, value, accent = false, isExternal = false }:any) {
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 28px",
        textDecoration: "none",
        transition: "background 0.15s",
        cursor: "pointer",
      }}
      className="border-b hover:bg-primary/50"
  
    >
      {/* Icon circle */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }} className="text-muted-foreground border">
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 3,
          fontFamily: "'Geist Mono', monospace",
        }} className="text-muted-foreground">
          {label}
        </div>
        <div style={{
          fontSize: 13,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontFamily: "'Geist Mono', monospace",
        }} className="text-foreground">
          {value}
        </div>
      </div>

      {/* Arrow */}
      <div style={{ opacity: 0.3, color: "var(--color-text-primary, #1a1714)", flexShrink: 0 }}>
        <ArrowIcon />
      </div>
    </a>
  );
}

// ─── Section label ─────────────────────────────────────────────
function SectionLabel({ children }:any) {
  return (
    <div style={{
      padding: "16px 28px 4px",
      fontSize: 9,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: "var(--color-text-secondary, #8c8680)",
      opacity: 0.6,
      fontFamily: "'Geist Mono', monospace",
    }}>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function ContactCard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Geist+Mono:wght@300;400&display=swap');
        .cc-row-last { border-bottom: none !important; }
      `}</style>

      <div style={{
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        maxWidth: 420,
        fontFamily: "'Geist Mono', monospace",
        
      }} className="bg-secondary border">

        {/* ── Header ────────────────────────────────────────── */}
        <div style={{
          padding: "28px 28px 20px",
          position: "relative",
        }} className="border-b">
          {/* Gold accent bar */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "#fff",
          }} />

          <div style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            Contact
          </div>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30,
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: 4,
          }} className="text-foreground">
            {CONTACT.brandName}
          </div>

          <div style={{
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary, #8c8680)",
          }}>
            {CONTACT.brandSub}
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────── */}
        <div style={{ paddingBottom: 8 }}>

          {/* Instagram */}
          <SectionLabel>Social</SectionLabel>
          <Row
            href={CONTACT.instagram.url}
            icon={<InstaIcon />}
            label="Instagram"
            value={CONTACT.instagram.handle}
            accent
            isExternal
          />

          {/* Email */}
          <SectionLabel>Email</SectionLabel>
          <Row
            href={`mailto:${CONTACT.email.address}`}
            icon={<MailIcon />}
            label={CONTACT.email.label}
            value={CONTACT.email.address}
          />

          {/* Phones */}
          <SectionLabel>Phone</SectionLabel>
          {CONTACT.phones.map((phone, i) => (
            <div
              key={phone.href}
              className={i === CONTACT.phones.length - 1 ? "cc-row-last" : ""}
            >
              <Row
                href={phone.href}
                icon={<PhoneIcon />}
                label={phone.label}
                value={phone.number}
              />
            </div>
          ))}

        </div>
      </div>
    </>
  );
}