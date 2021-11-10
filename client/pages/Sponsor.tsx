import { useUser } from '../hooks';
import styled from 'styled-components';
import { Button, CenterContent } from '../styles';
import Title from '../components/Title';
import { TournamentData } from '../types';
import { usePut } from '../hooks';
import TextInput from '../components/TextInput';

export const Description = styled.p`
	font-size: 25px;
	padding: 1rem;
	text-align: center;
`;

export const FlexBox = styled.div`
    display: flex;
`;

export default function Sponsor() {
    const { user, setUser } = useUser();
    return (
    <CenterContent>
        <Title>Sponsor</Title>

        {/* Tournament Details  Date - Time - Number of holes (From EditTournament.tsx)*/}
        {/* const {
		data: tournament,
		loading,
		error,
		refetch,
	} = useGet<TournamentData>(`/tournaments/${id}`); */}

        {/* Sponser Money Amount */}

        <Description>Sponsor Account Balance: <br/> {user.balance}</Description>

        {/* Prize portion of sponsered amount */}
        <Description>Winnings Pool</Description>
        <TextInput
				placeholder="Tournament Prize"
                type="number"
                min="0"
                max={user.balance}
                defaultValue="3"
			/>

        {/* | 1st % | 2nd % | 3rd % |*/}
        <Description>Percentage of Winnings</Description>
            <br />
        <FlexBox>
        <br />
            1st:<TextInput
                id="1stPercentage"
				placeholder="1st Place Percentage"
                type="number"
                min="33"
                max="98"
                defaultValue="50"
                />
                <br />

            2nd:<TextInput
                id="2ndPercentage"
                placeholder="2nd Place Percentage"
                type="number"
                min="1"
                max="50"
                defaultValue="30"
                />
                <br />

            3rd:<TextInput
                id="3rdPercentage"
                placeholder="3rd Place Percentage"
                type="number"
                min="1"
                max="50"
                defaultValue="20"
                />
                <br />
        </FlexBox>

        <Description>URL Adversiting</Description>
        {/* Advertising banner url */}
        <TextInput placeholder="Advertising banner URL"/>

        {/* Confirm and sponsor */}
        <Button>Confirm and Sponsor</Button>

    </CenterContent>
    );
}