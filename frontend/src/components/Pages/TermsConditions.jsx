import React from 'react';

const wrap = { maxWidth: 820, margin: '0 auto', padding: '40px 20px 60px', lineHeight: 1.7, color: 'var(--text-dark, #1a1a2e)' };
const h1 = { color: 'var(--primary, #1a1a2e)', marginBottom: 6 };
const updated = { color: 'var(--text-muted, #6c757d)', fontSize: 13, marginBottom: 28 };
const h2 = { color: 'var(--primary, #1a1a2e)', marginTop: 28, marginBottom: 8, fontSize: 18 };

export default function TermsConditions() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Terms &amp; Conditions</h1>
      <p style={updated}>Last updated: {new Date().getFullYear()}</p>

      <p>
        By creating an account or making a reservation with Paradise Hotel, you agree to the
        terms below.
      </p>

      <h2 style={h2}>Reservations</h2>
      <p>
        Room and desk reservations are subject to availability and confirmation by our reception
        team. Reservation details, pricing, and cancellation terms are shown at the time of
        booking.
      </p>

      <h2 style={h2}>Payments</h2>
      <p>
        Payments made via CBE Birr or Telebirr are verified by our reception staff before a
        reservation is confirmed. Refunds are handled according to our refund review process.
      </p>

      <h2 style={h2}>Account responsibility</h2>
      <p>
        You are responsible for keeping your login credentials confidential and for all activity
        under your account.
      </p>

      <h2 style={h2}>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the reservation system
        after changes take effect constitutes acceptance of the updated terms.
      </p>

      <h2 style={h2}>Contact us</h2>
      <p>
        Questions about these terms can be sent through our <a href="/contact">Contact page</a>.
      </p>
    </div>
  );
}
