import React from 'react';
import { Image, Header } from 'semantic-ui-react';

const CombinedImage = props => {
	return (
		props.url ?
		<> 
			<Header as="h3">Voila! Here's what I whipped up for you...</Header>
			<Image src={props.url} size='medium' bordered /> 
		</>
		: ''
	)
};

export default CombinedImage;