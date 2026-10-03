import React from 'react';

const wrap = { maxWidth: 820, margin: '0 auto', padding: '40px 20px 60px', lineHeight: 1.7, color: 'var(--text-dark, #1a1a2e)' };
const h1 = { color: 'var(--primary, #1a1a2e)', marginBottom: 6 };
const updated = { color: 'var(--text-muted, #6c757d)', fontSize: 13, marginBottom: 28 };
const h2 = { color: 'var(--primary, #1a1a2e)', marginTop: 28, marginBottom: 8, fontSize: 18 };

export default function PrivacyPolicy() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Privacy Policy</h1>
      <p style={updated}>Last updated: {new Date().getFullYear()}</p>

      <p>
        Paradise Hotel ("we", "us", "our") respects your privacy. This policy explains what
        information we collect through our reservation system and how we use it.
      </p>

      <h2 style={h2}>Information we collect</h2>
      <p>
        When you register, book a room or desk, order food, or make a payment, we collect the
        details you provide — such as your name, email, phone number, and, where required for
        check-in, a copy of your ID card.
      </p>

      <h2 style={h2}>How we use it</h2>
      <p>
        We use this information to manage your reservations, process payments, send booking and
        verification emails, and provide customer support. We do not sell your personal
        information to third parties.
      </p>

      <h2 style={h2}>Data security</h2>
      <p>
        Passwords are stored using industry-standard hashing and are never visible to hotel
        staff. Access to guest records is limited to authorized reception, management, and admin
        accounts.
      </p>

      <h2 style={h2}>Contact us</h2>
      <p>
        Questions about this policy can be sent through our <a href="/contact">Contact page</a>.
      </p>
    </div>
  );
}
