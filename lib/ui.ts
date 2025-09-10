export function getSidebarStyle(): React.CSSProperties & Record<string, string> {
  return {
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  } as unknown as React.CSSProperties & Record<string, string>;
}
