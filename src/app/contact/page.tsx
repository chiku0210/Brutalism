"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";

export default function ContactPage() {
  const { playSound } = useAudio();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('thud');
    setSent(true);
  };

  return (
    <main id="main" style={{ backgroundColor: 'var(--void)', minHeight: '100vh' }}>
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '120px var(--page-padding) 80px',
        }}
      >
        <div style={{ marginBottom: '40px' }}>
          <div className="section-label">[04] CONTACT</div>
          <h2 className="section-title">OPEN CHANNEL</h2>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '15px',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '520px'
          }}>
            Remote-first. Backend-heavy. If the problem is interesting, the location is irrelevant.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              border: '1px solid var(--brass-dim)',
              backgroundColor: 'rgba(200,169,110,0.04)',
              padding: '32px',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brass)', letterSpacing: '0.15em', marginBottom: '10px' }}>TRANSMISSION RECEIVED</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--dust)', letterSpacing: '0.04em' }}>SHUTTER FIRED.</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '12px', lineHeight: 1.8 }}>
              Message logged. Response incoming within 24 hours.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { id: 'name',    label: 'NAME',    type: 'text',  required: true },
              { id: 'email',   label: 'EMAIL',   type: 'email', required: true },
            ].map(field => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--brass)',
                    letterSpacing: '0.15em',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}
                >
                  {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <span className="vf-tl" aria-hidden="true" />
                  <span className="vf-tr" aria-hidden="true" />
                  <span className="vf-bl" aria-hidden="true" />
                  <span className="vf-br" aria-hidden="true" />
                  <input
                    id={field.id}
                    type={field.type}
                    required={field.required}
                    value={form[field.id as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                    onFocus={() => playSound('solenoid')}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--dust)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      padding: '12px 14px',
                      outline: 'none',
                      letterSpacing: '0.04em',
                      transition: 'border-color 0.15s'
                    }}
                    onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--brass-dim)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                </div>
              </div>
            ))}

            <div>
              <label
                htmlFor="message"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--brass)',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}
              >
                MESSAGE
              </label>
              <div style={{ position: 'relative' }}>
                <span className="vf-tl" aria-hidden="true" />
                <span className="vf-tr" aria-hidden="true" />
                <span className="vf-bl" aria-hidden="true" />
                <span className="vf-br" aria-hidden="true" />
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  onFocus={() => playSound('solenoid')}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--dust)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    padding: '12px 14px',
                    outline: 'none',
                    letterSpacing: '0.04em',
                    resize: 'vertical',
                    transition: 'border-color 0.15s'
                  }}
                  onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--brass-dim)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              onMouseEnter={() => playSound('solenoid')}
              whileTap={{ scale: 0.98 }}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'transparent',
                border: '1px solid var(--brass-dim)',
                padding: '12px 28px',
                cursor: 'pointer',
                transition: 'border-color 0.12s ease'
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--brass-bright)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--brass-dim)')}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: 'var(--brass)',
                textTransform: 'uppercase'
              }}>
                [ FIRE SHUTTER ]
              </span>
            </motion.button>
          </form>
        )}

        {/* Quick links footer */}
        <div style={{
          marginTop: '80px',
          paddingTop: '32px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'GitHub', href: 'https://github.com/chiku0210' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/nielless-acharya' },
            { label: 'Email', href: 'mailto:nielless@gmail.com' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => playSound('solenoid')}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'color 0.15s'
              }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--brass)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
