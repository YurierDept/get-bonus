export function removeExtraSpaces(text = '') {
  return text.replace(/[ \t]+/g, ' ').trim();
}

export async function retryFn<T>(fn: () => Promise<T>, options: { retry: number; delay?: number }) {
  const { retry, delay = 1000 } = options;

  let lastError: any;
  for (let i = 0; i < retry; i++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;
      await sleep(delay);
    }
  }

  throw lastError;
}

export function sleep(timeout: number) {
  return new Promise<void>((res) => {
    setTimeout(() => res(), timeout);
  });
}
