export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

export const isClassFinished = (classData) => {
  return !!classData?.date_end;
};