type ActDividerProps = {
  num: string;
  title: string;
  variant?: 'default' | 'bridge';
};

export function ActDivider({ num, title, variant = 'default' }: ActDividerProps) {
  return (
    <div
      className={`marketing-act${variant === 'bridge' ? ' marketing-act--bridge' : ''}`}
      role="separator"
      aria-label={`Act ${num}`}
    >
      <span className="marketing-act__num">Act {num}</span>
      <span className="marketing-act__title">{title}</span>
      <span className="marketing-act__rule" aria-hidden />
    </div>
  );
}
