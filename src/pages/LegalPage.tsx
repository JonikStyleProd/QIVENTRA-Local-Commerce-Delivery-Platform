import React from 'react';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageHeading, PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { Stamp } from '../components/collage/Stamp';

const LegalShell: React.FC<{ note: string; title: string; lead?: string; children: React.ReactNode }> = ({
  note,
  title,
  lead,
  children,
}) => {
  const { t } = useLanguage();
  return (
    <PageShell width="narrow">
      <PageHeading note={note} title={title} lead={lead} />
      <div className="flex flex-wrap items-center gap-2 mt-3 mb-6">
        <Stamp tone="action">{t.demo.legal.demoStamp}</Stamp>
        <span className="text-sm font-bold text-ink-2">{t.demo.legal.demoNote}</span>
      </div>
      {children}
    </PageShell>
  );
};

const Sections: React.FC<{ sections: [string, string][] }> = ({ sections }) => (
  <div className="grid gap-4">
    {sections.map(([heading, text]) => (
      <Panel as="section" key={heading}>
        <h2 className="text-[22px] font-black leading-tight">{heading}</h2>
        <p className="mt-1 font-bold text-ink-2">{text}</p>
      </Panel>
    ))}
  </div>
);

export const PrivacyPage: React.FC = () => {
  const copy = useLanguage().t.demo.legal.privacy;
  return (
    <LegalShell note={copy.note} title={copy.title}>
      <Sections sections={copy.sections} />
    </LegalShell>
  );
};

export const TermsPage: React.FC = () => {
  const copy = useLanguage().t.demo.legal.terms;
  return (
    <LegalShell note={copy.note} title={copy.title}>
      <Sections sections={copy.sections} />
    </LegalShell>
  );
};

/** What was really done and what was not. It makes no claim of conforming to a standard. */
export const AccessibilityPage: React.FC = () => {
  const copy = useLanguage().t.demo.legal.accessibility;
  return (
    <LegalShell note={copy.note} title={copy.title} lead={copy.lead}>
      <div className="grid gap-6">
        <Panel as="section" tone="health">
          <SectionHeading title={copy.doneTitle} />
          <ul className="grid gap-2">
            {copy.done.map((item) => (
              <li key={item} className="flex items-start gap-2 font-bold">
                <CheckCircle2 aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel as="section">
          <SectionHeading title={copy.notCheckedTitle} />
          <ul className="grid gap-2">
            {copy.notChecked.map((item) => (
              <li key={item} className="flex items-start gap-2 font-bold">
                <CircleDashed aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel as="section" tone="accent">
          <h2 className="text-[22px] font-black leading-tight">{copy.contactTitle}</h2>
          <p className="mt-1 font-bold">{copy.contact}</p>
        </Panel>
      </div>
    </LegalShell>
  );
};
