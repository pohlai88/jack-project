import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { useSettingsMock } = vi.hoisted(() => ({
  useSettingsMock: vi.fn(),
}));

vi.mock('../SettingsProvider', () => ({
  useSettings: useSettingsMock,
}));

import { AIProviderSettings } from '../AIProviderSettings';

describe('AIProviderSettings', () => {
  const setSettings = vi.fn();
  const handleSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    useSettingsMock.mockReturnValue({
      ai: {
        provider: 'openai',
        apiKey: 'sk-test',
        embeddingModel: 'text-embedding-3-small',
        chatModel: 'gpt-4o-mini',
        extractionModel: 'gpt-4o-mini',
        temperature: 0.1,
        maxTokens: 4000,
      },
      settings: {
        ai: {
          provider: 'openai',
          apiKey: 'sk-test',
        },
      },
      setSettings,
      isPending: false,
      handleSave,
      tenantSlug: 'test-tenant',
    });
  });

  it('disables the test button while the request is in flight', async () => {
    const user = userEvent.setup();
    let resolveFetch: ((value: Response) => void) | null = null;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    render(<AIProviderSettings />);

    const button = screen.getByRole('button', { name: /Test Connection/i });
    await user.click(button);

    expect(button).toBeDisabled();

    if (!resolveFetch) {
      throw new Error('Expected fetch resolver to be set');
    }

    const completeFetch: (value: Response) => void = resolveFetch;

    completeFetch({
      json: async () => ({
        ok: true,
        message: 'OpenAI connection verified successfully.',
        durationMs: 25,
      }),
    } as Response);

    await screen.findByText('OpenAI connection verified successfully.');
    expect(button).not.toBeDisabled();
  });

  it('renders the success message from the endpoint', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          ok: true,
          message: 'OpenAI connection verified successfully.',
          durationMs: 20,
        }),
      } as Response),
    );

    render(<AIProviderSettings />);

    await user.click(screen.getByRole('button', { name: /Test Connection/i }));

    expect(await screen.findByText('OpenAI connection verified successfully.')).toBeInTheDocument();
  });

  it('clears the previous test result when the API key changes', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          ok: true,
          message: 'OpenAI connection verified successfully.',
          durationMs: 20,
        }),
      } as Response),
    );

    render(<AIProviderSettings />);

    await user.click(screen.getByRole('button', { name: /Test Connection/i }));
    expect(await screen.findByText('OpenAI connection verified successfully.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('API Key'), { target: { value: 'sk-updated' } });

    await waitFor(() => {
      expect(screen.queryByText('OpenAI connection verified successfully.')).not.toBeInTheDocument();
    });
  });

  it('renders provider-specific error messages', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          ok: false,
          message: 'OpenAI rejected the provided API key.',
          code: 'INVALID_CREDENTIALS',
        }),
      } as Response),
    );

    render(<AIProviderSettings />);

    await user.click(screen.getByRole('button', { name: /Test Connection/i }));

    expect(await screen.findByText('OpenAI rejected the provided API key.')).toBeInTheDocument();
  });
});
