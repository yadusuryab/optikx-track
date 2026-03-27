"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;

  const footerLinks = {
    help: [
      { label: "Contact Us", href: "https://OPTIKX.in/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "https://OPTIKX.in/privacy-policy" },
      { label: "Terms & Conditions", href: "https://OPTIKX.in/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
    social: [
      { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTA || "https://instagram.com/OPTIKX.IN" },
    ],
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Geist+Mono:wght@300;400&display=swap');

        .ftr-root {
          font-family: 'Geist Mono', monospace;
          border-top: 1px solid var(--ftr-border, #e8e4de);
        }

        /* ── Marquee ─────────────────────────────────────── */
        .ftr-marquee-wrap {
          background: var(--ftr-ink, #1a1714);
          overflow: hidden;
          padding: 12px 0;
          position: relative;
        }
        .ftr-marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: ftrMarquee 28s linear infinite;
        }
        .ftr-marquee-track:hover { animation-play-state: paused; }
        @keyframes ftrMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ftr-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          padding: 0 32px;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ftr-cream, #faf8f5);
          font-family: 'Geist Mono', monospace;
        }
        .ftr-marquee-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--ftr-gold, #c9a96e);
          flex-shrink: 0;
        }

        /* ── Main body ───────────────────────────────────── */
        .ftr-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 56px 24px 48px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 600px) {
          .ftr-body {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }

        /* Brand column */
        .ftr-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          letter-spacing: 0.06em;
          line-height: 1;
          margin-bottom: 10px;
        }
        .ftr-brand-sub {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .ftr-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          font-weight: 300;
          line-height: 1.6;
          max-width: 240px;
        }

        /* Links column */
        .ftr-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 48px;
        }
        @media (max-width: 400px) {
          .ftr-links-grid { grid-template-columns: 1fr; }
        }
        .ftr-link-group-label {
          font-size: 8px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .ftr-link {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--ftr-stone, #8c8680);
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.2s;
          line-height: 1;
        }
        .ftr-link:hover { color: var(--ftr-ink, #1a1714); }
        .ftr-link:last-child { margin-bottom: 0; }

        /* Instagram CTA */
        .ftr-insta-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--ftr-stone, #8c8680);
          text-decoration: none;
          transition: color 0.2s;
          margin-bottom: 10px;
        }
        .ftr-insta-link:hover { color: var(--ftr-gold, #c9a96e); }
        .ftr-insta-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }

        /* ── Divider ─────────────────────────────────────── */
        .ftr-divider {
          max-width: 900px;
          margin: 0 auto;
          height: 1px;
          background: var(--ftr-border, #e8e4de);
        }

        /* ── Bottom bar ──────────────────────────────────── */
        .ftr-bottom {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ftr-copy {
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ftr-stone, #8c8680);
        }
        .ftr-maker {
          font-size: 9px;
          letter-spacing: 0.12em;
          color: var(--ftr-stone, #8c8680);
        }
        .ftr-maker a {
          color: var(--ftr-gold, #c9a96e);
          text-decoration: none;
          font-style: italic;
          transition: opacity 0.2s;
        }
        .ftr-maker a:hover { opacity: 0.7; }
      `}</style>

      <footer className="ftr-root">

        {/* Marquee */}
        <div className="ftr-marquee-wrap">
          <div className="ftr-marquee-track">
            {/* Duplicate for seamless loop */}
            {[...Array(2)].map((_, di) => (
              <React.Fragment key={di}>
                {["OPTIKX Order Tracking", "Track Your Package", "Shipped With Care", "OPTIKX Order Tracking", "Fast & Secure Delivery"].map((text, i) => (
                  <span key={i} className="ftr-marquee-item">
                    {text}
                    <span className="ftr-marquee-dot" />
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="ftr-body">

          {/* Brand */}
          <div>
            <div className="ftr-brand-name  text-foreground">OPTIKX</div>
            <div className="ftr-brand-sub">Order Tracking Portal</div>
            <div className="ftr-tagline">
              Know exactly where your order is, every step of the way.
            </div>
          </div>

          {/* Links */}
          <div className="ftr-links-grid">

            {/* Help */}
            <div>
              <div className="ftr-link-group-label">Help</div>
              {footerLinks.help.map(l => (
                <Link key={l.label} href={l.href} className="ftr-link">{l.label}</Link>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div className="ftr-link-group-label">Legal</div>
              {footerLinks.legal.map(l => (
                <Link key={l.label} href={l.href} className="ftr-link">{l.label}</Link>
              ))}
            </div>

            {/* Follow */}
            <div>
              <div className="ftr-link-group-label">Follow</div>
              <a
                href={footerLinks.social[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="ftr-insta-link"
              >
                <Instagram className="ftr-insta-icon" />
                @optikx.in
              </a>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div style={{ padding: "0 24px" }}>
          <div className="ftr-divider" />
        </div>

        {/* Bottom */}
        <div className="ftr-bottom">
          <div className="ftr-copy">
            © {currentYear} OPTIKX. All rights reserved.
          </div>
          <div className="ftr-maker">
            Made by{" "}
            <a href="https://instagram.com/getshopigo" target="_blank" rel="noopener noreferrer">
              Shopigo
            </a>
          </div>
        </div>

      </footer>
    </>
  );
}

export { Footer };