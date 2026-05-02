import { useEffect } from 'react';

export default function MetaTags({ title, description, image }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ProofHire`;
    }

    const updateMeta = (name, content) => {
      if (!content) return;
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        const newMeta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          newMeta.setAttribute('property', name);
        } else {
          newMeta.setAttribute('name', name);
        }
        newMeta.setAttribute('content', content);
        document.head.appendChild(newMeta);
      }
    };

    updateMeta('description', description);
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

  }, [title, description, image]);

  return null;
}
