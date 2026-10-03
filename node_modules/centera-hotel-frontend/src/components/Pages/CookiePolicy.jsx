import React from 'react';

const wrap = { maxWidth: 820, margin: '0 auto', padding: '40px 20px 60px', lineHeight: 1.7, color: 'var(--text-dark, #1a1a2e)' };
const h1 = { color: 'var(--primary, #1a1a2e)', marginBottom: 6 };
const updated = { color: 'var(--text-muted, #6c757d)', fontSize: 13, marginBottom: 28 };
const h2 = { color: 'var(--primary, #1a1a2e)', marginTop: 28, marginBottom: 8, fontSize: 18 };

export default function CookiePolicy() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Cookie Policy</h1>
      <p style={updated}>Last updated: {new Date().getFullYear()}</p>

      <p>
        This site uses a small amount of local browser storage to keep you signed in and to
        remember basic preferences while you use the reservation system.
      </p>

      <h2 style={h2}>What we store</h2>
      <p>
        A login session token is stored in your browser so you don't have to sign in again on
        every page. This is required for the booking, dashboard, and payment features to work.
      </p>

      <h2 style={h2}>Third-party services</h2>
      <p>
        If you sign in with Google, Google's own cookie policy applies to that sign-in process.
      </p>

      <h2 style={h2}>Managing storage</h2>
      <p>
        You can clear your browser's local storage at any time; doing so will sign you out of
        your account.
      </p>

      <h2 style={h2}>Contact us</h2>
      <p>
        Questions about this policy can be sent through our <a href="/contact">Contact page</a>.
      </p>
    </div>
  );
}
