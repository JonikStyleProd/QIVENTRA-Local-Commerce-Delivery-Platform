import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { pathFor } from '../router/paths';
import { LinkButton } from '../components/ui/LinkButton';
import { PageHeading, PageShell } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';

interface NotFoundViewProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionTo?: string;
}

/** The "nothing here" screen, also used for an unknown shop, product or order. */
export const NotFoundView: React.FC<NotFoundViewProps> = ({ title, description, actionText, actionTo }) => {
  const { t } = useLanguage();
  const copy = t.demo.notFound;

  return (
    <PageShell width="narrow" className="pt-10 desk:pt-16">
      <PageHeading note={copy.note} title={title ?? copy.title} />
      <Panel tape="yellow" className="max-w-[560px] mt-5">
        <p className="font-bold">{description ?? copy.desc}</p>
        <div className="flex flex-wrap gap-2.5 mt-4">
          <LinkButton to={actionTo ?? pathFor('catalog')} variant="secondary">
            {actionText ?? copy.toShops}
          </LinkButton>
          <LinkButton to={pathFor('home')} variant="outline">
            {copy.toHome}
          </LinkButton>
        </div>
      </Panel>
    </PageShell>
  );
};

export const NotFoundPage: React.FC = () => <NotFoundView />;
