import { useState } from 'react';
import styled from 'styled-components';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { DrawerItemAction } from './shared';

const DropDownContent = styled.div<{ show: boolean }>`
	max-height: ${({ show }) => (show ? '100%' : '0')};
	overflow: hidden;
	border-left: 1px solid ${({ theme }) => theme.textColor};
	margin-left: 1.7rem;
	padding-left: 1rem;
`;

const DownArrow = styled(IoMdArrowDropdown)`
	margin-left: auto;
`;

const UpArrow = styled(IoMdArrowDropup)`
	margin-left: auto;
`;

interface DropDownProps {
	header: React.ReactNode;
	children: React.ReactNode;
}

export default function DrawerDropDown({ header, children }: DropDownProps) {
	const [show, setShow] = useState(false);

	return (
		<div>
			<DrawerItemAction onClick={() => setShow(!show)}>
				{header}

				{show ? <DownArrow size={20} /> : <UpArrow size={20} />}
			</DrawerItemAction>
			<DropDownContent show={show}>{children}</DropDownContent>
		</div>
	);
}
