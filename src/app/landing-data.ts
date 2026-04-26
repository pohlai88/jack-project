/**
 * Landing page metadata that stays stable across locales.
 */

export interface PricingPlanDefinition {
  id: 'free' | 'pro' | 'enterprise';
  price: string;
  highlighted?: boolean;
}

export const LANDING_PRICING_PLANS: PricingPlanDefinition[] = [
  {
    id: 'free',
    price: '$0',
  },
  {
    id: 'pro',
    price: 'Demo',
    highlighted: true,
  },
  {
    id: 'enterprise',
    price: 'Demo',
  },
];
