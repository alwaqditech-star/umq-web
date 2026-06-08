export const publicNavLinks = [
  { key: "home", path: "", sectionKey: null },
  { key: "about", path: "/about", sectionKey: null },
  { key: "services", path: "/services", sectionKey: "services" },
  { key: "projects", path: "/projects", sectionKey: "projects" },
  { key: "blog", path: "/blog", sectionKey: "blog" },
  { key: "contact", path: "/contact", sectionKey: null },
] as const;

export type PublicNavLink = (typeof publicNavLinks)[number];
