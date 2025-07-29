'use client';

import { ThemeProvider, ToastProvider } from '@once-ui-system/core';
import { style } from '@/resources/once-ui.config';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      theme={style.theme as any}
      neutral={style.neutral as any}
      brand={style.brand as any}
      accent={style.accent as any}
      solid={style.solid as any}
      solidStyle={style.solidStyle as any}
      border={style.border as any}
      surface={style.surface as any}
      transition={style.transition as any}
      scaling={style.scaling as any}
    >
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
