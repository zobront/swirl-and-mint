import React, { useState, useEffect } from 'react'
import { Container, Header, Button, Form, Divider } from 'semantic-ui-react'

import Layout from '../components/Layout'
import CombinedImage from '../components/CombinedImage';
import NFTForm from '../components/NFTForm';
import LoadingPanel from '../components/LoadingPanel';
// import SuccessPanel from '../components/SuccessPanel';
import Footer from '../components/Footer';

export default function Home() {
  const [combinedImgUrl, setCombinedImgUrl] = useState();
  const [etherscanUrl, setEtherscanUrl] = useState();
  const [openseaUrl, setOpenseaUrl] = useState();
  const [firstButtonText, setFirstButtonText] = useState('Make Me a Masterpiece!');
  const [deployStatus, setDeployStatus] = useState('pending');
  const [hasMetamask, setHasMetamask] = useState(false);
  const [chainId, setChainId] = useState();

  const createCombinedImage = async (e) => {
    e.preventDefault();
    const NSTForm = e.target;
    const contentEl = NSTForm["content"]
    const styleEl = NSTForm["style"]

    let nstHeaders = new Headers();
    nstHeaders.append("api-key", "e10f2b1a-27a5-455a-b242-931c6ccbe395");

    let body = new FormData()
    body.append("content", contentEl.files[0], contentEl.value)
    body.append("style", styleEl.files[0], styleEl.value)

    let nstRequestOptions = { method: 'POST', headers: nstHeaders, body: body };
    let nstImageUrl = '';

    try {
      const nst_resp = await fetch("https://api.deepai.org/api/fast-style-transfer", nstRequestOptions) 
      const nst_result = await nst_resp.text()
      nstImageUrl = JSON.parse(nst_result).output_url
      console.log(nstImageUrl)
      setCombinedImgUrl(nstImageUrl)
      setFirstButtonText('Try Again?')
    } catch (err) {
      console.log('error', err)
    }
  }

  useEffect( async () => {
    if (typeof window.ethereum !== 'undefined') {
      setHasMetamask(true);
    }

    const chain = await ethereum.request({ method: 'eth_chainId' });
    setChainId(chain);

    ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }, [])

  return (
    <Container fluid>
      <Header as="h1">Swirl and Mint</Header>
      <Header as="h4">Creatively combine your favorite photos in seconds to create unique art, then mint your favorites as a 1/1 NFTs in one click.</Header>
      
      <Form id="make-image-form" onSubmit={createCombinedImage}>
        <Form.Group widths='equal'>
          <Form.Input label="Upload a Content Image" type="file" name="content" />
          <Form.Input label="Upload a Style Image" type="file" name="style" />
        </Form.Group>
        <Form.Group className="field-around-btn">
          <Form.Button primary id="make-image-btn" type="submit">{firstButtonText}</Form.Button>
        </Form.Group>
      </Form>

      <CombinedImage url={combinedImgUrl} />

      <NFTForm hasMetamask={hasMetamask} combinedImgUrl={combinedImgUrl} 
        setEtherscanUrl={setEtherscanUrl} setOpenseaUrl={setOpenseaUrl} 
        deployStatus={deployStatus} setDeployStatus={setDeployStatus} 
        setChainId={setChainId} chainId={chainId} />
      <LoadingPanel deployStatus={deployStatus} etherscanUrl={etherscanUrl} openseaUrl={openseaUrl} />
      <Footer />
    </Container>
  );
}