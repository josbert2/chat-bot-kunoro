import type { ReactNode } from "react";

export default function WidgetTestLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Layout sin sidebar para la página de test
  return <>{children}</>;
}


