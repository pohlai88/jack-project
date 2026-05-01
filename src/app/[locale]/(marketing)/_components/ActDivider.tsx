type ActDividerProps = {
  num: string;
  title: string;
};

export function ActDivider({ num, title }: ActDividerProps) {
  return (
    <div className="marketing-act" role="separator" aria-label={`Act ${num}`}>
      <span className="marketing-act__num">Act {num}</span>
      <span className="marketing-act__title">{title}</span>
      <span className="marketing-act__rule" aria-hidden />
    </div>
  );
}
