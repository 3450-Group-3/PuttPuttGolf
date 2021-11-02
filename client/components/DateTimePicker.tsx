import DateTimePicker, { Props as PickerProps } from 'react-datetime-picker';
import { AiOutlineCalendar } from 'react-icons/ai';
import Input, { Props as InputProps } from './Input';

type Props = Omit<InputProps, 'children'> & PickerProps;
export default function Picker({
	title,
	error,
	icon,
	noError = false,
	...props
}: Props) {
	return (
		<Input
			icon={<AiOutlineCalendar size={40} />}
			title={title}
			error={error}
			noError={noError}
		>
			<DateTimePicker
				{...props}
				className="picker"
				calendarIcon={null}
				clearIcon={null}
			/>
		</Input>
	);
}
