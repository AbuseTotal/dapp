import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AbiItem } from "web3-utils";

import {
  Card,
  HStack,
  Box,
  Text,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock, faGlobe, faQrcode, faUser } from '@fortawesome/free-solid-svg-icons'

import { EventData } from "web3-eth-contract";

import { useWeb3 } from "@/hooks/useWeb3";
import SubmissionContractABI from "@/abis/Submission.json";


const getLockIcon = (locked: boolean) =>
  locked ? faLock : faUnlock;

// type SubmissionLiveFeedProps = {
//   data: {
//     logIndex: number;
//     address: string;
//     url: string;
//   }[];
// };

function SubmissionLiveFeed() {
  const { connected, connect, disconnect, getConnection } = useWeb3();
  const [submissionEvents, setSubmissionEvents] = useState<EventData[]>([]);
  const connection = getConnection();

  useEffect(() => {
    if (!connected) { return };

    const contract = new connection.Web3.eth.Contract(
      SubmissionContractABI as AbiItem[],
      process.env.NEXT_PUBLIC_SUBMISSION_CONTRACT_ADDRESS,
    );

    contract.getPastEvents("URLSubmitted", { fromBlock: 0 }).then(events => {
      events.reverse()
      const newEvents = events.slice(0, 10);
      console.log(newEvents);
      setSubmissionEvents(newEvents)
    });
  }, [connected, connection])

  return (
    <>
      <SimpleGrid py={1} px={4} columns={12} spacing={3}>
        <GridItem colSpan={1}>
          <Box display={{ base: "hidden", md: "block" }}>
            <FontAwesomeIcon icon={faLock} />
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <HStack spacing={2} verticalAlign="middle">
            <Box display={{ base: "hidden", md: "block" }}>
              <FontAwesomeIcon icon={faUser} />
            </Box>
            <Text>User</Text>
          </HStack>
        </GridItem>
        <GridItem colSpan={7}>
          <HStack spacing={2} verticalAlign="middle">
            <Box display={{ base: "hidden", md: "block" }}>
              <FontAwesomeIcon icon={faQrcode} />
            </Box>
            <Text>Address</Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack spacing={2} verticalAlign="middle">
            <Box display={{ base: "hidden", md: "block" }}>
              <FontAwesomeIcon icon={faGlobe} />
            </Box>
            <Text>URL</Text>
          </HStack>
        </GridItem>
      </SimpleGrid>
      <AnimatePresence initial={false}>
        {submissionEvents.map((event) => (
          <Card
            key={event.signature}
            as={motion.div}
            layout
            initial={{ opacity: 0, y: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 10,
              scale: 1,
              transition: { duration: 1 },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.1 },
            }}
            variant="unstyled"
            my={1}
            py={1}
            px={4}
            borderRadius="none"
          >
            <SimpleGrid columns={12} spacing={3}>
              <GridItem colSpan={1}>
                <FontAwesomeIcon
                  icon={getLockIcon(event.returnValues.url.startsWith("https://"))}
                  color={event.returnValues.url.startsWith("https://") ? "green" : "red"}
                />
              </GridItem>
              <GridItem colSpan={2}>
                Unknown
              </GridItem>
              <GridItem colSpan={7}>
                {event.address}
              </GridItem>
              <GridItem colSpan={2}>
                {event.returnValues.url}
              </GridItem>
            </SimpleGrid>
          </Card>
        ))}
      </AnimatePresence>
    </>
  );
}

export default SubmissionLiveFeed;
export type { SubmissionLiveFeedProps };
