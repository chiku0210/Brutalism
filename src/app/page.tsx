import SectionShell from '../components/SectionShell';

export default function Home() {
  return (
    <div className="page-wrap">
      <section id="hero" className="stub">
        {/* Placeholder for M2 Hero Boot */}
      </section>

      <section id="darkroom" className="section stub">
        <SectionShell 
          label="[04] THE DARKROOM" 
          title="DARKROOM" 
          meta="8 NEGATIVES · 4 PROD · 4 LAB" 
        />
      </section>

      <section id="blueprint" className="section stub">
        <SectionShell 
          label="[05] DEPLOYMENT HISTORY" 
          title="CONTACT SHEET" 
        />
      </section>

      <section id="contact" className="section stub">
        <SectionShell 
          label="[06] CONTACT" 
          title="OPEN CHANNEL" 
        />
      </section>
    </div>
  );
}
