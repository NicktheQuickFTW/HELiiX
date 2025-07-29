'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  ToastProvider,
  ThemeProvider,
  DataThemeProvider,
  IconProvider,
} from '@once-ui-system/core';
import type {
  Theme,
  NeutralColor,
  Schemes,
  SolidType,
  SolidStyle,
  BorderStyle,
  SurfaceStyle,
  TransitionStyle,
  ScalingSize,
  ChartVariant,
  ChartMode,
} from '@once-ui-system/core/dist/contexts/ThemeProvider';
import { AuthProvider } from '@/lib/auth-context';
import { style, dataStyle } from '@/resources/once-ui.config';
import { iconLibrary } from '@/lib/icons';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        theme={style.theme as Theme}
        neutral={style.neutral as NeutralColor}
        brand={style.brand as Schemes}
        accent={style.accent as Schemes}
        solid={style.solid as SolidType}
        solidStyle={style.solidStyle as SolidStyle}
        border={style.border as BorderStyle}
        surface={style.surface as SurfaceStyle}
        transition={style.transition as TransitionStyle}
        scaling={style.scaling as ScalingSize}
      >
        <DataThemeProvider
          variant={dataStyle.variant as ChartVariant}
          mode={dataStyle.mode as ChartMode}
          height={dataStyle.height}
          axis={{
            stroke: dataStyle.axis.stroke,
          }}
          tick={{
            fill: dataStyle.tick.fill,
            fontSize: dataStyle.tick.fontSize,
            line: dataStyle.tick.line,
          }}
        >
          <IconProvider icons={iconLibrary}>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </IconProvider>
        </DataThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
