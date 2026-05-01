import { AUDIENCE_LABEL, type AudienceId, SECTION_AUDIENCE_MAP } from '../_content/audiences';

type Props = {
  /** Section id key in SECTION_AUDIENCE_MAP, OR a literal audience list. */
  sectionId?: keyof typeof SECTION_AUDIENCE_MAP;
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
