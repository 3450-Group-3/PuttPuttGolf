import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { AiOutlineCalendar } from 'react-icons/ai';
import styled from 'styled-components';
import DateTimePicker from '../components/DateTimePicker';
import Input from '../components/Input';
import TextInput from '../components/TextInput';
import { Button, CenterContent } from '../styles';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 300px;
`;

interface Inputs {
	holeCount: number;
	date: Date;
}

interface Props {
	readonly onSubmit: (data: Inputs) => any;
	readonly defaultValues?: Partial<Inputs>;
}

export default function TournamentForm({ onSubmit, defaultValues }: Props) {
	const {
		register,
		formState: { errors },
		control,
		handleSubmit,
	} = useForm<Inputs>({ defaultValues });

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="date"
				control={control}
				defaultValue={new Date()}
				render={({ field: { value, onChange } }) => (
					<DateTimePicker
						value={value}
						error={errors.date?.message}
						onChange={onChange}
						title="Start Date & Time"
					/>
				)}
			/>
			<TextInput
				{...register('holeCount', {
					required: 'Hole Count is Required',
					min: 0,
					valueAsNumber: true,
					validate: (v) => !isNaN(v),
				})}
				type="number"
				title="Number of Holes"
				placeholder="i.e: 1, 16, 20"
				error={errors.holeCount?.message}
				icon={<AiOutlineCalendar size={40} />}
			/>
			<Button type="submit">Submit</Button>
		</Form>
	);
}
