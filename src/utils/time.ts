export const roundedNow = (): string => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const rounded = Math.round(minutes / 30) * 30;
  const h = Math.floor(rounded / 60) % 24;
  const m = rounded % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export const diffMinutes = (start: string, end: string): number => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

export const formatMinutes = (min: number): string =>
  `${Math.floor(min / 60)}:${(min % 60).toString().padStart(2, "0")}`;

