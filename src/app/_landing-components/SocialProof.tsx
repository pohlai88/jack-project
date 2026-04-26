/**
 * Social Proof Section for Landing Page
 *
 * Showcases:
 * - Testimonials from users/teams
 * - Sponsor logos (with placeholders)
 * - Build social trust for sponsor appeal
 */

import { Star } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'TechCorp',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    company: 'GrowthStudio',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    rating: 5,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    company: 'InnovateLabs',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    rating: 5,
  },
];

/**
 * Sponsor logos (placeholder grid for future integration)
 */
const sponsors = [
  { id: '1', placeholder: true },
  { id: '2', placeholder: true },
  { id: '3', placeholder: true },
  { id: '4', placeholder: true },
];

export function SocialProof() {
  const t = useTranslations('landing.socialProofSection');

  return (
    <div className="space-y-16">
      {/* Testimonials */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-4">{t('title')}</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('description')}</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground text-sm leading-relaxed mb-6 flex-1 italic">
                "{t(`testimonials.${testimonial.id}.text`)}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('roleAt', { role: t(`testimonials.${testimonial.id}.role`), company: testimonial.company })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sponsors Section */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-12">{t('sponsorsTitle')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              {sponsor.placeholder ? (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-medium">
                    {t('sponsorLabel', { index: sponsor.id })}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">{t('comingSoon')}</p>
                </div>
              ) : (
                <Image
                  src={`/logos/${sponsor.id}.svg`}
                  alt={t('sponsorLabel', { index: sponsor.id })}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          {t('sponsorCta')}{' '}
          <a href="mailto:sponsors@example.com" className="text-primary hover:underline font-medium">
            {t('sponsorCtaLink')}
          </a>
        </p>
      </div>
    </div>
  );
}
