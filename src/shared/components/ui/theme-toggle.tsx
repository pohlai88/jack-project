'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

function useAfterHydration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useAfterHydration();
  const selectedTheme = theme ?? 'system';

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-border/50 bg-background/50"
        type="button"
        disabled
      >
        <span className="sr-only">Hydrating theme...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="card-interactive relative h-9 w-9 overflow-hidden border-border/70 bg-card hover:bg-accent"
          type="button"
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 text-foreground transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 text-foreground transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 border-border/80 p-1 shadow-md">
        <DropdownMenuRadioGroup value={selectedTheme} onValueChange={setTheme}>
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedTheme === option.value;

            return (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className={cn(
                  'cursor-pointer rounded-sm py-2 pr-3 text-sm transition-colors',
                  isSelected
                    ? 'bg-primary/10 font-medium text-primary focus:bg-primary/10 focus:text-primary'
                    : 'text-muted-foreground hover:text-foreground focus:text-foreground',
                )}
              >
                <Icon className="mr-2 h-4 w-4" aria-hidden />
                <span>{option.label}</span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
