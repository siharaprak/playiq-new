import { useEffect, RefObject } from 'react';

function hashContentSignature(signature: string): string {
  let hash = 2166136261;
  for (let i = 0; i < signature.length; i++) {
    hash ^= signature.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Persists in-progress form drafts in localStorage while preventing stale or cross-module
 * answers from pre-populating into updated or unrelated prompts.
 */
export function useFormAutoSave(
  storageKey: string,
  formRef: RefObject<HTMLFormElement | null>,
  contentSignature?: string,
) {
  const expectedSig = contentSignature ? hashContentSignature(contentSignature) : null;

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // 1. Hydrate from local storage on mount only if signature matches current prompt content
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        let values: Record<string, any> | null = null;

        if (expectedSig) {
          if (parsed && typeof parsed === 'object' && parsed.__playiq_v2_sig === expectedSig && parsed.values) {
            values = parsed.values as Record<string, any>;
          } else {
            // Stale pre-v2 or mismatched prompt content: clear so wrong answers never pre-fill
            localStorage.removeItem(storageKey);
          }
        } else if (parsed && typeof parsed === 'object') {
          values = (parsed.values && typeof parsed.values === 'object' ? parsed.values : parsed) as Record<string, any>;
        }

        if (values) {
          Object.keys(values).forEach((key) => {
            const inputs = form.elements.namedItem(key);
            if (!inputs) return;
            if (inputs instanceof RadioNodeList) {
              const el = Array.from(inputs).find(
                (item) => (item as HTMLInputElement).value === values![key],
              ) as HTMLInputElement | undefined;
              if (el) el.checked = true;
            } else {
              const inputEl = inputs as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
              // Preserve server-returned defaultValue after a validation error if already populated
              if (!inputEl.value && typeof values![key] === 'string') {
                inputEl.value = values![key];
              }
            }
          });
        }
      } catch (err) {
        console.error('Failed to parse auto-save data', err);
        localStorage.removeItem(storageKey);
      }
    }

    // 2. Setup save listener
    const handleChange = () => {
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      const payload = expectedSig ? { __playiq_v2_sig: expectedSig, values: data } : data;
      localStorage.setItem(storageKey, JSON.stringify(payload));
    };

    form.addEventListener('input', handleChange);
    form.addEventListener('change', handleChange);

    return () => {
      form.removeEventListener('input', handleChange);
      form.removeEventListener('change', handleChange);
    };
  }, [storageKey, formRef, expectedSig]);

  const clearAutoSave = () => {
    localStorage.removeItem(storageKey);
  };

  return { clearAutoSave };
}
