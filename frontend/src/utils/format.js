export const formatDate = (value) => {
  if (!value) return 'Now';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
};
