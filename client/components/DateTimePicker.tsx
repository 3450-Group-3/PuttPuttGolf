import DateTimePicker, { Props } from 'react-datetime-picker';
import { AiOutlineCalendar } from 'react-icons/ai';
import styled from 'styled-components';

const DatePickerWrapper = styled.div`
	.picker {
		margin-bottom: 10px;
		border: none;
		font-size: 17px;
		display: flex;
		flex-direction: column;
		max-width: 300px;
		background-color: ${({ theme }) => theme.secondary};
		box-sizing: border-box;
		border-radius: 3px;

		.react-datetime-picker__wrapper {
			height: 60px;
			border: none;
			padding: 0px 8px;
		}

		.react-datetime-picker__calendar-button {
			color: ${({ theme }) => theme.textColor};
		}

		&:focus-within {
			border: 1px solid grey;
		}

		input,
		select {
			color: ${({ theme }) => theme.textColor};
		}
	}
`;

export default function CreateTournament(props: Props) {
	return (
		<DatePickerWrapper>
			<DateTimePicker
				{...props}
				className="picker"
				calendarIcon={<AiOutlineCalendar size={40} />}
				clearIcon={null}
			/>
		</DatePickerWrapper>
	);
}
