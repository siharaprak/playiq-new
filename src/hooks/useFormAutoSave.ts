import { useEffect, RefObject } from 'react';

export function useFormAutoSave(
  storageKey: string,
  formRef: RefObject<HTMLFormElement | null>
) {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // 1. Hydrate from local storage on mount
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach((key) => {
          const inputs = form.elements.namedItem(key);
          if (inputs) {
            // Handle radio button groups
            if (inputs instanceof RadioNodeList) {
              const el = Array.from(inputs).find((el) => (el as HTMLInputElement).value === data[key]) as HTMLInputElement;
              if (el) el.checked = true;
            } else {
              // Handle standard inputs, selects, textareas
              const inputEl = inputs as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
              inputEl.value = data[key];
            }
          }
        });
      } catch (err) {
        console.error('Failed to parse auto-save data', err);
      }
    }

    // 2. Setup save listener
    const handleChange = () => {
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem(storageKey, JSON.stringify(data));
    };

    // Listen for both input (typing) and change (select, radio) events
    form.addEventListener('input', handleChange);
    form.addEventListener('change', handleChange);

    return () => {
      form.removeEventListener('input', handleChange);
      form.removeEventListener('change', handleChange);
    };
  }, [storageKey, formRef]);

  const clearAutoSave = () => {
    localStorage.removeItem(storageKey);
  };

  return { clearAutoSave };
}
