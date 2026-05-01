import {
  AUDIENCE_LABEL,
  type AudienceId,
  type MarketingSectionId,
  SECTION_AUDIENCE_MAP,
} from '../_content/marketing-audience.contract';

type Props = {
  /** Section id key in SECTION_AUDIENCE_MAP, OR a literal audience list. */
  sectionId?: MarketingSectionId;
  audiences?: readonly AudienceId[];
};

export function AudienceChips({ sectionId, audiences }: Props) {
  const list = audiences ?? (sectionId ? SECTION_AUDIENCE_MAP[sectionId] : []);
  if (!list || list.length === 0) return null;

  return (
    <ul className="marketing-audience-chips" aria-label="Primary audiences">
      {list.map((id) => (
        <li key={id}>{AUDIENCE_LABEL[id]}</li>
      ))}
    </ul>
  );
}
