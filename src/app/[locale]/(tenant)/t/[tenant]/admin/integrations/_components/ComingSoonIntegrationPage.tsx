import { CalendarOff } from 'lucide-react';

import { AdminPageHeader } from '@/features/admin';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

interface ComingSoonIntegrationPageProps {
  tenant: string;
  name: string;
  description: string;
  backLabel: string;
}

export function ComingSoonIntegrationPage({ tenant, name, description, backLabel }: ComingSoonIntegrationPageProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={name}
        description={description}
        backHref={`/t/${tenant}/admin/integrations`}
        backLabel={backLabel}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarOff className="h-4 w-4" />
            Integration Coming Soon
          </CardTitle>
          <CardDescription>{name} is not yet production-ready in this implementation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant="outline">Coming Soon</Badge>
          <p className="text-sm text-muted-foreground">
            You can keep this placeholder in place until OAuth routes, tenant settings persistence, and sync pipelines
            are fully implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
