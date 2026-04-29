import { defineDocsManifest } from '@/docs/runtime/docs-contract-manifest';

export default defineDocsManifest({
  id: 'profile',
  title: 'Member Profile',
  module: 'Member Experience',
  owner: 'member-platform',
  releaseState: 'released',
  summary: 'Member profile and profile settings surfaces.',
  routes: ['/[locale]/t/[tenant]/profile', '/[locale]/t/[tenant]/profile/settings'],
  permissions: [],
  workflows: [
    {
      id: 'profile.update-settings',
      title: 'Profile settings update',
      summary: 'Members review and update profile details in tenant context.',
    },
  ],
  actions: [
    {
      id: 'profile.update',
      title: 'Update profile',
      summary: 'Submit profile changes through the profile settings form.',
    },
  ],
  apis: [],
  errors: [
    {
      code: 'AFD-PROFILE-UPDATE',
      title: 'Profile update failed',
      mitigation: 'Validate submitted profile data and confirm the user has an active tenant session.',
    },
  ],
  troubleshooting: [
    {
      id: 'profile-save-fails',
      title: 'Profile settings do not save',
      symptom: 'Profile changes are rejected or not persisted.',
      resolution: 'Check required fields, session state, and profile update service errors.',
    },
  ],
});
