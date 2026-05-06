const STORAGE_KEY = 'work-hours-tracker:display-names';

export type TrackerDisplayNames = {
  myName: string;
  managerName: string;
};

const empty: TrackerDisplayNames = { myName: '', managerName: '' };

export function loadTrackerDisplayNames(): TrackerDisplayNames {
  if (typeof window === 'undefined') return { ...empty };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return { ...empty };
    const o = parsed as Record<string, unknown>;
    return {
      myName: typeof o.myName === 'string' ? o.myName : '',
      managerName: typeof o.managerName === 'string' ? o.managerName : '',
    };
  } catch {
    return { ...empty };
  }
}

export function saveTrackerDisplayNames(data: TrackerDisplayNames): void {
  if (typeof window === 'undefined') return;
  const payload: TrackerDisplayNames = {
    myName: data.myName.trim(),
    managerName: data.managerName.trim(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function hasConfiguredDisplayNames(data: TrackerDisplayNames): boolean {
  return data.myName.trim() !== '' || data.managerName.trim() !== '';
}
