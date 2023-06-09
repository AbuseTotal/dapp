import Image from "next/image";
import {
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  HStack,
} from '@chakra-ui/react';

import { ConnectorList,Warning, Connector, Alert,  Agreement, AddressStyle}  from "../styles/web3"

import useAddress from "@/hooks/useAddress";
import useMetaMaskOnboarding from '@/hooks/useMetaMaskOnboarding';
import {useEffect, useState} from "react";
import {Web3Connection} from "@taikai/dappkit";
import ReputationContractABI from "@/abis/Reputation.json";

interface ConnectProps {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  getConnection: () => Web3Connection;
}

interface OnActionClick {
  onClick: () => void;
}

const minifyAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const ClickableEthAddress = ({ onClick }: OnActionClick)=> {
    const { address = "" } = useAddress();

    return (
      <Button 
        size="md"
        onClick={onClick}
        >      
          {address && minifyAddress(address)}
        </Button>
    );
};

const ShowEthAddress = ()=> {
  const { address = "" } = useAddress();
  return (
    <AddressStyle>
      {address}
  </AddressStyle>
  );
}

function Connect({ connect, connected, disconnect, getConnection }: ConnectProps) {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isMetaMaskInstalled, startOnboarding } = useMetaMaskOnboarding();
  const [reputationBalance, setReputationBalance] = useState(0);

  const handleDisconnect = () => {
    disconnect();
    onModalClose();
  };

  const getReputationBalance = () => {
    const connection = getConnection();
    const contract = new connection.Web3.eth.Contract(
      ReputationContractABI as AbiItem[],
      process.env.NEXT_PUBLIC_SUBMISSION_CONTRACT_ADDRESS,
    );
    contract.getPastEvents("ReputationUpdated", { fromBlock: 0 })
      .then(events => {
        console.log(events);
        setReputationBalance(events[0]?.returnValues?.newReputation ?? 0);
      });
  };

  useEffect(() => {
    if (!connected) { return };
    getReputationBalance()
  }, [connected]);

  return (
    <Box>
      {connected && (
        <HStack>
          <Button variant="outline" colorScheme="green" size="md" disabled>
            Reputation: {reputationBalance}
          </Button>
          <ClickableEthAddress onClick={onModalOpen} />
        </HStack>
      )}
      {!connected && (
        <Button variant="outline" colorScheme="blue" size="md" disabled onClick={onModalOpen}>
          Connect
        </Button>
      )}

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
                  By connecting a wallet, you agree to the &quot;LayerX Web Boilerplate&quot; Terms of Service
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
    </Box>
  );
}

export default Connect;
