# Deprecated Weblate Notes

Weblate is not an authoritative localization system for Afenda.

This directory is retained only to show that an earlier Weblate bootstrap draft was superseded. The current operating model is Crowdin-based:

- platform docs: [../crowdin/README.md](../crowdin/README.md)
- platform config: [../../crowdin.yml](../../crowdin.yml)
- architecture decision: [../../architecture/adr/0005-continuous-localization-operating-model.md](../../architecture/adr/0005-continuous-localization-operating-model.md)

Do not create Weblate-originated translation PRs. Crowdin-generated PRs must use the `i18n-platform-sync` label.
