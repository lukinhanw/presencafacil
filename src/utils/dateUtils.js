export const formatDateTime = (date) => {
	if (!date) return '';
	return new Date(date).toLocaleString();
};

export const isClassFinished = (classData) => {
	return !!classData?.date_end;
};

export const formatDateTimeHourMin = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};