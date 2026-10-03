import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Fill in real profile URLs here to make the matching icon appear in the
 * footer. Left blank by default so we never link out to a placeholder/fake
 * page — icons with an empty URL simply aren't rendered.
 */
const SOCIAL_LINKS = {
  facebook: '',
  telegram: '',
  instagram: '',
  youtube: '',
};

const SocialIcon = ({ label, href, children }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={styles.socialIcon}
    >
      {children}
    </a>
  );
};

const Footer = () => {
  const hasSocial = Object.values(SOCIAL_LINKS).some(Boolean);

  return (
    <footer className="site-footer" style={styles.footer}>
      <div style={styles.grid}>
        {/* Branding */}
        <div style={styles.col}>
          <div style={styles.brand}>
            <span style={{ fontSize: 22 }}>🏨</span>
            <span style={styles.brandText}>Paradise Hotel</span>
          </div>
          <p style={styles.desc}>
            A full-service hotel in Debre Markos, Ethiopia — comfortable rooms, workspace desks,
            restaurant dining, and reliable guest service for travelers and locals alike.
          </p>
        </div>

        {/* Quick links */}
        <div style={styles.col}>
          <h4 style={styles.heading}>Explore</h4>
          <ul style={styles.linkList}>
            <li><Link to="/rooms" style={styles.link}>Rooms</Link></li>
            <li><Link to="/discounts" style={styles.link}>Discounts</Link></li>
            <li><Link to="/about" style={styles.link}>About</Link></li>
            <li><Link to="/contact" style={styles.link}>Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div style={styles.col}>
          <h4 style={styles.heading}>Legal</h4>
          <ul style={styles.linkList}>
            <li><Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" style={styles.link}>Terms &amp; Conditions</Link></li>
            <li><Link to="/cookie-policy" style={styles.link}>Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Social */}
        {hasSocial && (
          <div style={styles.col}>
            <h4 style={styles.heading}>Follow Us</h4>
            <div style={styles.socialRow}>
              <SocialIcon label="Facebook" href={SOCIAL_LINKS.facebook}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
              </SocialIcon>
              <SocialIcon label="Telegram" href={SOCIAL_LINKS.telegram}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.6 20c-.2 1-.9 1.2-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.3-8.4c.4-.4-.1-.6-.6-.2L6 12.5l-4.9-1.5c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.7.2 1.3 1.3z"/></svg>
              </SocialIcon>
              <SocialIcon label="Instagram" href={SOCIAL_LINKS.instagram}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>
              </SocialIcon>
              <SocialIcon label="YouTube" href={SOCIAL_LINKS.youtube}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.5-5.3c-.3-1-1.1-1.8-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.6c-1 .3-1.8 1.1-2.1 2.1C1 8.4 1 12 1 12s0 3.6.5 5.3c.3 1 1.1 1.8 2.1 2.1C5.4 20 12 20 12 20s6.6 0 8.4-.6c1-.3 1.8-1.1 2.1-2.1.5-1.7.5-5.3.5-5.3zM9.8 15.5V8.5l6 3.5-6 3.5z"/></svg>
              </SocialIcon>
            </div>
          </div>
        )}
      </div>

      <div style={styles.bottomBar}>
        © {new Date().getFullYear()} Paradise Hotel. All Rights Reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'var(--primary, #1a1a2e)',
    color: '#e8e8ee',
    marginTop: 40,
  },
  grid: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 24px 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 28,
  },
  col: { minWidth: 0 },
  brand: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  brandText: { fontWeight: 800, fontSize: 17, color: '#fff' },
  desc: { fontSize: 13.5, lineHeight: 1.6, color: '#b8bacb', margin: 0 },
  heading: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: 'var(--accent, #f0a500)',
    margin: '0 0 14px',
  },
  linkList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  link: { color: '#cfd1e0', textDecoration: 'none', fontSize: 14 },
  socialRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    color: '#e8e8ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
  bottomBar: {
    textAlign: 'center',
    padding: '14px 16px',
    fontSize: 12.5,
    color: '#9698ab',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
};

export default Footer;
