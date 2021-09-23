import React from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';

const SuccessPanel = props => {
	const visitPage = (url) => {
		window.open(url, '_blank');
	}

	return (
		props.deployStatus == 'success' ?
		<>
			<Divider />
			<Header as="h3">Success! It'll be live on OpenSea in 30-60 seconds :)</Header>
			<div className="success-buttons">
				<Button onClick={() => visitPage(props.etherscanUrl)} content="View on Etherscan" secondary />
				<Button onClick={() => visitPage(props.openseaUrl)} content="View on OpenSea" primary />
			</div>
		</>
		: ''
	)
}

export default SuccessPanel;