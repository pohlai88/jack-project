import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type PrimitiveProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  className?: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function MarketingSection({ className, children, ...props }: PrimitiveProps<'section'>) {
  return (
    <section className={joinClasses('marketing-section', className)} {...props}>
      <div className="marketing-section__inner">{children}</div>
    </section>
  );
}

export function MarketingSectionHeader({
  eyebrow,
  title,
  copy,
  titleId,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  copy?: ReactNode;
  titleId: string;
}) {
  return (
    <div className="marketing-section__header">
      <p className="marketing-eyebrow">{eyebrow}</p>
      <h2 id={titleId} className="marketing-section__title">
        {title}
      </h2>
      {copy ? <p className="marketing-section__copy">{copy}</p> : null}
    </div>
  );
}

export function MarketingPanel({ className, ...props }: PrimitiveProps<'div'>) {
  return <div className={joinClasses('marketing-panel', className)} {...props} />;
}

export function MarketingPanelHeader({ className, ...props }: PrimitiveProps<'div'>) {
  return <div className={joinClasses('marketing-panel__header', className)} {...props} />;
}

export function MarketingStatusPill({ className, ...props }: PrimitiveProps<'span'>) {
  return <span className={joinClasses('marketing-status-pill', className)} {...props} />;
}

export function MarketingMetaLabel({ className, ...props }: PrimitiveProps<'span'>) {
  return <span className={joinClasses('marketing-meta-label', className)} {...props} />;
}
