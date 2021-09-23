import React from 'react';
import { Image, Header } from 'semantic-ui-react';

const CombinedImage = props => {
	return (
		props.url ?
		<> 
			<Header as="h3">{props.headerContent}</Header>
			<Image src={props.url} size='medium' bordered /> 
		</>
		: ''
	)
};

export default CombinedImage;