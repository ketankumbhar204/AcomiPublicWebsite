type SeoProps = {
  title: string;
  description: string;
  path: string;
};

export function applySeo({ title, description, path }: SeoProps) {
  const url = `https://www.acomi.in${path === '/' ? '/' : path}`;
  document.title = title;

  const set = (selector: string, attr: string, value: string) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  set('meta[name="description"]', 'content', description);
  set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:title"]', 'content', title);
  set('meta[property="og:description"]', 'content', description);
  set('meta[property="og:url"]', 'content', url);
  set('meta[name="twitter:title"]', 'content', title);
  set('meta[name="twitter:description"]', 'content', description);
}
