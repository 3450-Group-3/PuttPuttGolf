import { useState } from 'react';
import { SingleValue } from 'react-select';
import styled from 'styled-components';
import { usePut } from '../hooks';
import { Button, Message } from '../styles';
import { ID } from '../types';
import Select, { Option } from './Select';
import TextInput from './TextInput';
import { MessageError } from '../types';

const Container = styled.div`
	display: flex;
	padding: 2em;
	border-radius: 5px;
	margin-bottom: 10px;
	flex-wrap: wrap;
	justify-content: center;
`;

const BalanceContainer = styled.div`
	margin-right: 2em;
	padding-left: 1em;
	border-left: 1px solid ${({ theme }) => theme.textColor};
`;

const Header = styled.h1`
	font-weight: 400;
	font-size: 1.4em;
`;

const CurrentBalance = styled.h2`
	font-size: 4em;
`;

const BalanceInputs = styled.div`
	display: flex;
	flex-direction: column;
`;

interface Props {
	readonly currentBalance: number;
	readonly userId: ID;
}

enum Options {
	Deposit = 1,
	Withdraw = 2,
}

export default function AccountBalance({ currentBalance, userId }: Props) {
	const [balance, setBalance] = useState<number>(currentBalance);
	const [selected, setSelected] = useState<number | string>(Options.Deposit);
	const [amount, setAmount] = useState<string>('');
	const [{ error, loading }, updateBalance] = usePut<
		{ balance: number },
		MessageError
	>(`/users/${userId}/balance`);

	const options: Option[] = [
		{ value: Options.Deposit, label: 'Deposit' },
		{ value: Options.Withdraw, label: 'Withdraw' },
	];

	const handleClick = async () => {
		const parsed = parseInt(amount);
		if (parsed > 0) {
			const updated =
				selected === Options.Deposit ? balance + parsed : balance - parsed;

			const res = await updateBalance({
				data: { balance: updated },
			});
			setBalance(res.data.balance);
		}
	};

	return (
		<Container>
			<BalanceContainer>
				<Header>Current Account Balance</Header>
				<CurrentBalance>$ {balance}</CurrentBalance>
			</BalanceContainer>
			<BalanceInputs>
				{error && <Message error>{error?.response?.data?.message}</Message>}
				<TextInput
					type="number"
					placeholder="Amount"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
				/>
				<Select
					options={options}
					value={options.find((c) => selected === c.value)}
					onChange={(selectedOption) => {
						const value = (selectedOption as SingleValue<Option>)?.value;
						if (value) {
							setSelected(value);
						}
					}}
				/>
				<Button disabled={!amount} onClick={handleClick}>
					{loading ? '...' : 'Submit'}
				</Button>
			</BalanceInputs>
		</Container>
	);
}
