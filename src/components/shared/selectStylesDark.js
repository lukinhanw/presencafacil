// Shared select styles for consistent look across the application
export const selectStylesDark = {
	control: (base, state) => ({
		...base,
		backgroundColor: 'rgb(255 255 255 / 0.09)',
		borderColor: state.isFocused ? 'rgb(14 165 233 / .5)': 'rgb(255 255 255 / 0.05)',
		'&:hover': {
			borderColor: 'rgb(14 165 233 / .7)' // Increased opacity for better contrast
		},
		boxShadow: 'rgb(14 165 233 / .5)',
		borderWidth: '1px',
		padding: '1px',
		borderRadius: '0.375rem',
		color: '#CCD0D6',
		transition: 'all 200ms ease'
	}),
	menuPortal: (base) => ({
		...base,
		zIndex: 9999 // Increased z-index to appear above modal
	}),
	menu: (base) => ({
		...base,
		zIndex: 9999, // Increased z-index to appear above modal
		backgroundColor: 'rgb(29 34 45)',
		backdropFilter: 'blur(15px)',
		border: '1px solid rgba(255, 255, 255, 0.05)',
		borderRadius: '0.5rem',
		boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
		overflow: 'hidden'
	}),
	menuList: (base) => ({
		...base,
		padding: '4px'
	}),
	option: (base, state) => ({
		...base,
		backgroundColor: state.isSelected
			? 'rgba(59, 130, 246, 0.3)' // Increased opacity for better visibility
			: state.isFocused
				? 'rgba(59, 130, 246, 0.2)' // Increased opacity
				: 'transparent',
		color: '#CCD0D6',
		borderRadius: '0.375rem',
		margin: '2px 0',
		'&:hover': {
			backgroundColor: state.isSelected
				? 'rgba(59, 130, 246, 0.4)' // Increased opacity for better contrast
				: 'rgba(59, 130, 246, 0.3)' // Increased opacity for better contrast
		}
	}),
	input: (base) => ({
		...base,
		color: 'inherit'
	}),
	singleValue: (base) => ({
		...base,
		color: 'var(--tw-text-opacity-1)',
	}),
	multiValue: (base) => ({
		...base,
		backgroundColor: 'rgba(59, 130, 246, 0.2)', // Increased opacity
		borderRadius: '0.375rem'
	}),
	multiValueLabel: (base) => ({
		...base,
		color: 'inherit' // Will inherit text color from parent
	}),
	multiValueRemove: (base) => ({
		...base,
		color: '#3b82f6',
		':hover': {
			backgroundColor: 'rgba(59, 130, 246, 0.3)', // Increased opacity for better contrast
			color: '#1c335b'
		}
	}),
	placeholder: (base) => ({
		...base,
		color: 'var(--tw-placeholder-opacity)'
	}),
	clearIndicator: (base) => ({
		...base,
		color: 'inherit',
		':hover': {
			color: '#ef4444'
		}
	}),
	dropdownIndicator: (base) => ({
		...base,
		color: 'inherit',
		':hover': {
			color: '#3b82f6'
		}
	})
};