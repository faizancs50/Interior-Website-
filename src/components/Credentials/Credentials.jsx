import React, { useEffect, useRef } from 'react';
import { staggerFadeUp } from '../../animations/scrollAnimations';
import './Credentials.css';

const Credentials = () => {
  const sectionRef = useRef(null);
  const badgesRef = useRef([]);

  const credentials = [
    {
      id: 'casetrust',
      name: 'CaseTrust Accredited',
      badge: '/images/credentials/casetrust.webp',
      description: '100% deposit protection scheme with transparent cost breakdown and consumer dispute mechanism.'
    },
    {
      id: 'bizsafe',
      name: 'bizSAFE STAR',
      badge: '/images/credentials/bizsafe.webp',
      description: 'Highest WSH council workplace safety standards enforced across all active renovation job sites.'
    },
    {
      id: 'bca',
      name: 'BCA Registered',
      badge: '/images/credentials/bca.webp',
      description: 'Licensed building and construction authority contractor for structural alterations and masonry.'
    },
    {
      id: 'hdb',
      name: 'HDB DRC Licensed',
      badge: '/images/credentials/hdb.webp',
      description: 'Listed under the HDB Directory of Renovation Contractors with certified site management protocols.'
    }
  ];

  useEffect(() => {
    if (badgesRef.current.length > 0) {
      staggerFadeUp(badgesRef.current, {
        trigger: sectionRef.current,
        stagger: 0.12,
        y: 25
      });
    }
  }, []);

  return (
    <section className="credentials-section" ref={sectionRef} id="credentials-section">
      <div className="container">
        <div className="credentials-header">
          <span className="eyebrow">ASSURANCE &amp; INTEGRITY</span>
          <h2 className="credentials-title">Trusted &amp; Accredited</h2>
          <p className="credentials-lead">
            We hold Singapore’s highest tier of statutory accreditations so you can renovate
            with absolute confidence and complete financial protection.
          </p>
        </div>

        <div className="credentials-grid">
          {credentials.map((cred, idx) => (
            <div
              key={cred.id}
              ref={(el) => (badgesRef.current[idx] = el)}
              className="credential-card"
            >
              <div className="credential-badge-box">
                <img
                  src={cred.badge}
                  alt={cred.name}
                  className="credential-img"
                  loading="lazy"
                />
              </div>
              <h3 className="credential-name">{cred.name}</h3>
              <p className="credential-desc">{cred.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credentials;
