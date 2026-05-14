"use client";

import React from "react";

// Depth-of-field classes from spec §05
type FrameDepth = 'frame-near' | 'frame-mid' | 'frame-far' | 'frame-past';

interface TimelineEntryProps {
  depth: FrameDepth;
  timestamp: string;
  title: string;
  description: string;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ depth, timestamp, title, description }) => {
  // Timestamp color from spec: near=brass, mid/far/past=muted cascade
  const tsColor =
    depth === 'frame-near'  ? 'var(--brass)' :
    depth === 'frame-mid'   ? 'var(--muted2)' :
    depth === 'frame-far'   ? 'var(--muted2)' :
    'var(--border)';

  return (
    <div
      className={`film-frame ${depth}`}
      tabIndex={0}
      role="listitem"
    >
      {/* Sprocket holes rendered via CSS ::before on .film-frame */}
      <div
        className="frame-ts"
        style={{ color: tsColor, fontSize: '9px', letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
      >
        {timestamp}
      </div>
      <div
        className="frame-title"
        style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}
      >
        {title}
      </div>
      <p style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '600px' }}>
        {description}
      </p>
    </div>
  );
};

export const StackSnapshot = () => {
  const stack = [
    { name: 'NODE.JS',              type: 'backend'  },
    { name: 'TYPESCRIPT',           type: 'backend'  },
    { name: 'POSTGRESQL',           type: 'backend'  },
    { name: 'PYTHON',               type: 'backend'  },
    { name: 'C++',                  type: 'backend'  },
    { name: 'AWS',                  type: 'devops'   },
    { name: 'DOCKER',               type: 'devops'   },
    { name: 'KUBERNETES',           type: 'devops'   },
    { name: 'JENKINS',              type: 'devops'   },
    { name: 'GH ACTIONS',           type: 'devops'   },
    { name: 'DATADOG',              type: 'devops'   },
    { name: 'NEXT.JS',              type: 'frontend' },
    { name: 'REDUX',                type: 'frontend' },
    { name: '[LLM AGENTS]',         type: 'ai'       },
    { name: '[LLM ORCHESTRATION]',  type: 'ai'       },
  ];

  return (
    <div style={{
      border: '1px solid var(--grid)',
      padding: '24px',
      backgroundColor: 'var(--surface)',
      marginTop: '40px'
    }}>
      <div style={{
        fontSize: '9px',
        color: 'var(--muted2)',
        letterSpacing: '0.1em',
        marginBottom: '16px',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase'
      }}>
        $ current --stack
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {stack.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              padding: '4px 10px',
              border: '1px solid',
              color:
                item.type === 'ai'      ? 'var(--brass)' :
                item.type === 'backend' ? 'var(--dust)'  :
                item.type === 'devops'  ? 'var(--ice)'   : 'var(--muted)',
              borderColor: item.type === 'ai' ? 'var(--brass-dim)' : 'var(--border)'
            }}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};
