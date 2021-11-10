import { useGet, useUser } from '../hooks';
import styled from 'styled-components';
import { Button, CenterContent } from '../styles';
import Title from '../components/Title';
import { TournamentData } from '../types';
import { usePut } from '../hooks';
import TextInput from '../components/TextInput';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';


export const Description = styled.p`
	font-size: 25px;
	padding: 1rem;
	text-align: center;
`;

export const FlexBox = styled.div`
    display: flex;
`;

interface Inputs{
    first: number; 
    second: number; 
    third: number;
    total: number;
    banner: string;
}

export default function Sponsor() {
    const { user, setUser } = useUser();
    const { id = null } = useParams<{ id: string }>();
	const {
		data: tournament,
		loading,
		error,
		refetch,
	} = useGet<TournamentData>(`/tournaments/${id}`);
    

    const [
		{ data: updateData, loading: updateLoading, error: updateError },
		update,
	] = usePut<TournamentData>(`/tournaments/${id}`);

    const {
		register,
		formState: { errors },
		control,
		handleSubmit,
	} = useForm<Inputs>({defaultValues: {first:50, second:30, third:20, total:3, banner:""}});
    
    return (
    <CenterContent>
        <Title>Sponsor</Title>

        {/* Sponser Money Amount */}

        <Description>Sponsor Account Balance: <br/> {user.balance}</Description>

        {/* Prize portion of sponsered amount */}
        <Description>Winnings Pool</Description>
        <form onSubmit={handleSubmit((data) => update({data: {...tournament, balance: data.total, advertisingBanner: data.banner}}))}>
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
            1st:<TextInput
                {...register('first', {
                    required: 'Must have number',
                    min: 33,
                    valueAsNumber: true,
                    validate: (v) => {return !isNaN(v)},
                })}
                id="1stPercentage"
				placeholder="1st Place Percentage"
                type="number"
                max="98"
                />
                <br />

            2nd:<TextInput
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

            3rd:<TextInput
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
        <TextInput placeholder="Advertising banner URL"/>

        {/* Confirm and sponsor */}
        <Button type="submit">Confirm and Sponsor</Button>
        </form>

    </CenterContent>
    );
}