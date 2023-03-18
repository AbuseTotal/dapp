import { useEffect, useState } from "react";
import Image from "next/image";
import nextBase64 from "next-base64";


import NextLink from 'next/link';
import {
  Box,
  Container,
  Flex,
  HStack,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Link,
  Button,
} from '@chakra-ui/react';
import { AbiItem } from 'web3-utils';
import { Formik, FormikProps } from "formik";

import useMetaMaskOnboarding from "@/hooks/useMetaMaskOnboarding";
import { useWeb3 } from "@/hooks/useWeb3";
import useAddress from "@/hooks/useAddress";
import Logo from "@/components/Logo";
import { ConnectorList,Warning, Connector, Alert,  Agreement, AddressStyle}  from "../styles/web3"
import SubmissionContractABI from "@/abis/Submission.json";
import { EventData } from "web3-eth-contract";
import SubmissionLiveFeed from "@/components/SubmissionLiveFeed";
import {useRouter} from "next/router";


type Form = {
  observable: string;
};

const minifyAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const ShowEthAddress = ()=> {
  const { address = "" } = useAddress();
  return (
    <AddressStyle>
      {address}
  </AddressStyle>
  );
}

interface OnActionClick {
  onClick: () => void;
}

const ClickableEthAddress = ({ onClick }: OnActionClick)=> {
    const { address = "" } = useAddress(); return (
      <Button 
        size="md"
        onClick={onClick}
        >      
          {address && minifyAddress(address)}
        </Button>
    );
  }

function Home() {
  const router = useRouter();
  const { connected, connect, disconnect, getConnection } = useWeb3();
  const { isMetaMaskInstalled, startOnboarding } = useMetaMaskOnboarding();
  const [pastEvents, setPastEvents] = useState<EventData[]>();

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const handleSubmit = ({ observable }: Form) => {
    const connection = getConnection();

    connection.getAddress().then((address) => {
      const contract = new connection.Web3.eth.Contract(
        SubmissionContractABI as AbiItem[],
        process.env.NEXT_PUBLIC_SUBMISSION_CONTRACT_ADDRESS,
        { from: address },
      );
      contract.methods.submitURL(observable)
        .send()
        .then(() => {
          const base64Encoded = nextBase64.encode(observable);
          router.push(`/observables/${base64Encoded}`);
        });
    });
  };

  const handleDisconnect = () => {
    disconnect();
    onModalClose();
  };

  useEffect(() => {
    if (!connected) { return };

    const connection = getConnection();
    const contract = new connection.Web3.eth.Contract(
      SubmissionContractABI as AbiItem[],
      process.env.NEXT_PUBLIC_SUBMISSION_CONTRACT_ADDRESS,
    );
    contract.getPastEvents("URLSubmitted", { fromBlock: 0 }).then(events => setPastEvents(events));
  }, [getConnection, connected])

  return (
    <Flex height="100vh" direction="column" bg="white">
      <Box p={4} w="100%">
        <Flex h="32px" justifyContent="space-between">
          <HStack zIndex={1} spacing={4}>
            <Link
              as={NextLink}
              fontWeight="200"
              color="gray.800"
              variant="link"
              href="/"
              _hover={{
                textDecoration: 'none',
                color: 'brand.50',
              }}
            >
              How it works
            </Link>
            <Link
              as={NextLink}
              fontWeight="200"
              color="gray.800"
              variant="link"
              href="/leaderboard"
              _hover={{
                textDecoration: "none",
                color: "brand.50",
              }}
            >
              Leaderboard
            </Link>
          </HStack>

          <HStack spacing={4}>
            {!connected && (
              <Button variant="outline" colorScheme="blue" size="md" disabled onClick={onModalOpen}>
                Connect
              </Button>
            )}
            {connected && <ClickableEthAddress onClick={onModalOpen} />}
          </HStack>
        </Flex>
      </Box>

      <Flex h="100%" direction="column" alignItems="center">
        <Container centerContent maxW="2xl" mt={24}>
          <Logo width={{ base: '300px', md: '500px' }} height="80px" />
          <Formik
            initialValues={{
              observable: '',
            }}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleSubmit: onSubmit }: FormikProps<Form>) => (
              <form style={{ width: '100%' }} onSubmit={onSubmit}>
                <Input
                  name="observable"
                  boxShadow="md"
                  mt={6}
                  autoFocus
                  placeholder="Submit a URL"
                  value={values.observable}
                  onChange={handleChange}
                />
              </form>
            )}
          </Formik>
        </Container>

        {connected && (
          <Box mt={12}>
            <SubmissionLiveFeed />
          </Box>
        )}
      </Flex>

      <Modal isOpen={isModalOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {!connected && isMetaMaskInstalled && (
              <>
                <Warning>
                  You don&apos;t have a wallet connect, please choose of the following options:
                </Warning>
                <ConnectorList>
                  <Connector onClick={() => connect()}>
                    <Image width={30} height={30} alt="Metamask" src="/metamask.png" />
                    <span>Connect with Metamask</span>
                  </Connector>
                </ConnectorList>
                <Agreement>
                  By connecting a wallet, you agree to the "LayerX Web Boilerplate" Terms of Service
                  and consent to its Privacy Policy.
                </Agreement>
              </>
            )}
            {!connected && !isMetaMaskInstalled && (
              <>
                <ConnectorList>
                  <Connector onClick={() => startOnboarding()}>
                    <Image width={30} height={30} alt="Metamask" src="/metamask.png" />
                    <span>Install Metamask</span>
                  </Connector>
                </ConnectorList>
                <Alert>
                  🚨 You don&apos;t have the metamask extension installed on your browser.
                </Alert>
              </>
            )}
            {connected && isMetaMaskInstalled && (
              <>
                <Warning>You are connected with Wallet address:</Warning>
                <ShowEthAddress />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {connected && (
              <Button
                color="red.500"
                variant="outline"
                disabled={!connected}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Home;
