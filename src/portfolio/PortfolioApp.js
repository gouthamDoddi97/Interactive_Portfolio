import { useEffect } from 'react';
import {
  profile,
  experience,
  skills,
  education,
  profileSummary,
  careerHighlights,
  earlyCareer,
  certificates,
  links,
  personalDetails,
} from '../resumeData';
import { downloadResume } from './utils/downloadResume';
import './portfolio.css';

const NAV = [
  { href: '#about', label: 'about' },
  { href: '#experience', label: 'experience' },
  { href: '#skills', label: 'skills' },
  { href: '#education', label: 'education' },
  { href: '#contact', label: 'contact' },
];

const PROJECTS = [
  {
    label: 'Whiff-theory',
    url: 'https://whiff-theory.com/',
    note: 'Perfume brand and MedusaJS e-commerce',
  },
  ...links,
];

function PortfolioApp() {
  useEffect(() => {
    document.documentElement.classList.add('portfolio-v2');
    return () => document.documentElement.classList.remove('portfolio-v2');
  }, []);

  const handleDownload = async () => {
    try {
      await downloadResume();
    } catch (err) {
      console.error(err);
      window.alert('Could not open resume for printing. Try resume-ats.html directly.');
    }
  };

  const availability = personalDetails.find((d) =>
    d.label.toLowerCase().includes('notice')
  )?.value;

  return (
    <div className="portfolio">
      <header className="portfolio-header">
        <div className="portfolio-header__brand">
          <span>~/</span>goutham<span>_doddi</span>
        </div>
        <nav className="portfolio-nav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <button type="button" className="portfolio-btn" onClick={handleDownload}>
            download_resume.pdf
          </button>
        </nav>
      </header>

      <main className="portfolio-main">
        <section className="portfolio-hero" aria-labelledby="hero-name">
          <p className="portfolio-hero__prompt">
            <span className="accent">$</span> whoami
          </p>
          <h1 id="hero-name">{profile.name}</h1>
          <p className="portfolio-hero__role">
            backend engineer · real-time systems · mqtt
          </p>
          <p className="portfolio-hero__meta">
            <span>{profile.location}</span>
            <span>{availability || 'Available for hire'}</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
          </p>
        </section>

        <section id="about" className="portfolio-section" aria-labelledby="about-title">
          <h2 id="about-title" className="portfolio-section__title">
            summary
          </h2>
          <p className="portfolio-summary">{profileSummary}</p>
        </section>

        <section
          id="experience"
          className="portfolio-section"
          aria-labelledby="exp-title"
        >
          <h2 id="exp-title" className="portfolio-section__title">
            experience
          </h2>
          {experience.map((job) => (
            <article key={`${job.company}-${job.period}`} className="portfolio-card">
              <h3>
                {job.title} — {job.company}
              </h3>
              <p className="portfolio-card__meta">
                {job.location} · {job.period}
              </p>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet.slice(0, 48)}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
          {earlyCareer.map((job) => (
            <article key={job.company} className="portfolio-card">
              <h3>
                {job.title} — {job.company}
              </h3>
              <p className="portfolio-card__meta">
                {job.location} · {job.period}
              </p>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet.slice(0, 48)}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="skills" className="portfolio-section" aria-labelledby="skills-title">
          <h2 id="skills-title" className="portfolio-section__title">
            skills
          </h2>
          <div className="portfolio-skills-grid">
            {skills.map((group) => (
              <div key={group.category} className="portfolio-skill-group">
                <strong>{group.category}</strong>
                <div className="portfolio-tags">
                  {group.items.map((item) => (
                    <span key={item} className="portfolio-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="education"
          className="portfolio-section"
          aria-labelledby="edu-title"
        >
          <h2 id="edu-title" className="portfolio-section__title">
            education
          </h2>
          {education.map((item) => (
            <article key={item.degree} className="portfolio-card">
              <h3>{item.degree}</h3>
              <p className="portfolio-card__meta">
                {item.institution} · {item.location} · {item.period}
              </p>
            </article>
          ))}
          <h2 className="portfolio-section__title" style={{ marginTop: '2rem' }}>
            certifications
          </h2>
          <ul className="portfolio-links">
            {certificates.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </section>

        <section className="portfolio-section" aria-labelledby="highlights-title">
          <h2 id="highlights-title" className="portfolio-section__title">
            highlights
          </h2>
          <ul className="portfolio-card" style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            {careerHighlights.map((item) => (
              <li key={item.slice(0, 40)} style={{ marginBottom: '0.5rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="portfolio-section" aria-labelledby="projects-title">
          <h2 id="projects-title" className="portfolio-section__title">
            projects
          </h2>
          <ul className="portfolio-links">
            {PROJECTS.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
                {item.note ? ` — ${item.note}` : ''}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="portfolio-section" aria-labelledby="contact-title">
          <h2 id="contact-title" className="portfolio-section__title">
            contact
          </h2>
          <ul className="portfolio-links">
            <li>
              <a href={`mailto:${profile.email}`}>Email: {profile.email}</a>
            </li>
            <li>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                Phone: {profile.phone}
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn: {profile.linkedin}
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub: {profile.github}
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="portfolio-footer">
        <span>Built on branch portfolio-v2 · terminal-lite</span>
        <a href={`${process.env.PUBLIC_URL}/legacy`} style={{ display: 'none' }} aria-hidden>
          legacy
        </a>
        <span>
          <a
            href={`${process.env.PUBLIC_URL || ''}/resume-ats.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            resume-ats.html
          </a>
        </span>
      </footer>
    </div>
  );
}

export default PortfolioApp;
