import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { useSettingsMock } = vi.hoisted(() => ({
  useSettingsMock: vi.fn(),
}));

vi.mock('../SettingsProvider', () => ({
  useSettings: useSettingsMock,
}));

import { StorageSettings } from '../StorageSettings';

describe('StorageSettings', () => {
  const setSettings = vi.fn();
  const handleSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    useSettingsMock.mockReturnValue({
      storage: {
        provider: 's3',
        endpoint: 'https://storage.example.com',
        publicEndpoint: 'https://cdn.example.com',
        accessKey: 'access',
        secretKey: 'secret',
        bucket: 'uploads',
        region: 'us-east-1',
        forcePathStyle: true,
      },
      settings: {
        storage: {
          provider: 's3',
          endpoint: 'https://storage.example.com',
          publicEndpoint: 'https://cdn.example.com',
          accessKey: 'access',
          secretKey: 'secret',
          bucket: 'uploads',
        },
      },
      setSettings,
      isPending: false,
      handleSave,
      tenantSlug: 'test-tenant',
    });
  });

  it('renders the success message from the endpoint', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          ok: true,
          message: 'Storage connection verified successfully.',
          durationMs: 33,
        }),
      } as Response),
    );

    render(<StorageSettings />);

    await user.click(screen.getByRole('button', { name: /Test Connection/i }));

    expect(await screen.findByText('Storage connection verified successfully.')).toBeInTheDocument();
  });

  it('clears the previous test result when the bucket changes', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          ok: true,
          message: 'Storage connection verified successfully.',
          durationMs: 33,
        }),
      } as Response),
    );

    render(<StorageSettings />);

    await user.click(screen.getByRole('button', { name: /Test Connection/i }));
    expect(await screen.findByText('Storage connection verified successfully.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Bucket Name'), { target: { value: 'other-bucket' } });

    await waitFor(() => {
      expect(screen.queryByText('Storage connection verified successfully.')).not.toBeInTheDocument();
    });
  });

  it('renders storage-specific error messages', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          ok: false,
          message: 'The configured bucket could not be found.',
          code: 'BUCKET_NOT_FOUND',
        }),
      } as Response),
    );

    render(<StorageSettings />);

    await user.click(screen.getByRole('button', { name: /Test Connection/i }));

    expect(await screen.findByText('The configured bucket could not be found.')).toBeInTheDocument();
  });
});
