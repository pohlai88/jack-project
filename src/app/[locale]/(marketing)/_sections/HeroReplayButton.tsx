'use client';

export function HeroReplayButton() {
  const replay = () => {
    const hero = document.querySelector<HTMLElement>('[data-marketing-hero]');
    if (!hero) return;

    hero.classList.remove('marketing-hero--animate');
    void hero.offsetWidth;
    hero.classList.add('marketing-hero--animate');
  };

  return (
    <button
      type="button"
      className="marketing-hero__replay"
      onClick={replay}
      aria-label="Replay the resolution sequence"
    >
      Replay
    </button>
  );
}
