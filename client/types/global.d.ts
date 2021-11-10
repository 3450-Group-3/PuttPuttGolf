declare module 'react-datetime-picker' {
	interface Props {
		value: Date;
		onChange: (date: Date) => any;
		className?: string;
		calendarIcon?: React.ReactNode | null;
		clearIcon?: React.ReactNode | null;
	}

	export default class DateTimePicker extends React.Component<Props> {}
}
