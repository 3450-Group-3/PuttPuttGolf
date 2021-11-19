import React from 'react';
import { useUser } from '../hooks';
import styled from 'styled-components';
import { Button } from '../styles';
import { ID, TournamentData } from '../types';
import { usePut } from '../hooks';
import TextInput from '../components/TextInput';
import { useForm } from 'react-hook-form';

export const Description = styled.p`
	font-size: 25px;
	padding: 1rem;
	text-align: center;
`;

export const FlexBox = styled.div`
	display: flex;
`;

interface Inputs {
	first: number;
	second: number;
	third: number;
	total: number;
	banner: string;
}

interface Props {
	readonly tournamentId: ID;
	readonly defaultValues: Partial<TournamentData>;
}

export default function SponsorForm({ tournamentId, defaultValues }: Props) {
	const { user, setUser } = useUser();
	const [
		{ data: updateData, loading: updateLoading, error: updateError },
		update,
	] = usePut<TournamentData>(`/tournaments/${tournamentId}/sponsor`);

	const {
		register,
		formState: { errors },
		control,
		handleSubmit,
	} = useForm<Inputs>({
		defaultValues: {
			first: Math.round(
				(defaultValues?.winningDistributions?.first || 0.5) * 100
			),
			second: Math.round(
				(defaultValues?.winningDistributions?.second || 0.3) * 100
			),
			third: Math.round(
				(defaultValues?.winningDistributions?.third || 0.2) * 100
			),
			total: defaultValues?.balance || 3,
			banner: defaultValues?.advertisingBanner || '',
		},
	});

	return (
		<form
			onSubmit={handleSubmit((data) =>
				update({
					data: {
						balanceDiff: data.total - (defaultValues.balance || 0),
						advertisingBanner: data.banner,
						winningDistributions: {
							first: (data.first / 100).toFixed(2),
							second: (data.second / 100).toFixed(2),
							third: (data.third / 100).toFixed(2),
						},
					},
				})
			)}
		>
			<TextInput
				{...register('total', {
					required: 'Must have sponsor money',
					min: 3,
					valueAsNumber: true,
					validate: (v) => !isNaN(v),
				})}
				error={errors.total?.message}
				placeholder="Tournament Prize"
				type="number"
				max={user.balance}
			/>

			{/* | 1st % | 2nd % | 3rd % |*/}
			<Description>Percentage of Winnings</Description>
			<br />
			<FlexBox>
				<br />
				1st:
				<TextInput
					{...register('first', {
						required: 'Must have number',
						min: 33,
						valueAsNumber: true,
						validate: (v) => {
							return !isNaN(v);
						},
					})}
					id="1stPercentage"
					placeholder="1st Place Percentage"
					type="number"
					max="98"
				/>
				<br />
				2nd:
				<TextInput
					{...register('second', {
						required: 'Must have number',
						min: 1,
						valueAsNumber: true,
						validate: (v) => !isNaN(v),
					})}
					id="2ndPercentage"
					placeholder="2nd Place Percentage"
					type="number"
				/>
				<br />
				3rd:
				<TextInput
					{...register('third', {
						required: 'Must have number',
						min: 1,
						valueAsNumber: true,
						validate: (v) => !isNaN(v),
					})}
					id="3rdPercentage"
					placeholder="3rd Place Percentage"
					type="number"
				/>
				<br />
			</FlexBox>

			<Description>URL Adversiting</Description>
			{/* Advertising banner url */}
			<TextInput placeholder="Advertising banner URL" />

			{/* Confirm and sponsor */}
			<Button type="submit">Confirm and Sponsor</Button>
		</form>
	);
}
