import { useEffect, useState } from "react";
import NextLink from "next/link";

import {
  Avatar,
  Box,
  Card,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { AbiItem } from "web3-utils";

import ReputationContractABI from "@/abis/Reputation.json";
import { useWeb3 } from "@/hooks/useWeb3";
import Logo from "@/components/Logo";
import {useRouter} from "next/router";
import Connect from "@/components/Connect";

interface Member {
  logIndex: number;
  address: string;
  tokenAmount: number;
}

const fakeMembers = [
  {
    logIndex: 0,
    address: "0x4C67B1Cc5ef9b98161885f9153011Bb8747d0B5B",
    tokenAmount: 30,
  },
  {
    logIndex: 1,
    address: "0x4C67B1Cc5ef9b98161885f9153011Bb8747d0B5B",
    tokenAmount: 12,
  },
  {
    logIndex: 2,
    address: "0x4C67B1Cc5ef9b98161885f9153011Bb8747d0B5B",
    tokenAmount: 90,
  },
];

function Leaderboard() {
  const router = useRouter();
  const { connected, connect, disconnect, getConnection } = useWeb3();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!connected) { return };

    const connection = getConnection();
    const contract = new connection.Web3.eth.Contract(
      ReputationContractABI as AbiItem[],
      process.env.NEXT_PUBLIC_SUBMISSION_CONTRACT_ADDRESS,
    );
    contract.getPastEvents("ReputationUpdated", { fromBlock: 0 }).then(events => {
      const members: Member[] = [];
      const seenAddresses: {[key: string]: boolean} = {};

      events.forEach(event => {
        if (event.address in seenAddresses) { return };
        seenAddresses[event.address] = true;
        members.push({ logIndex: event.logIndex, address: event.address, tokenAmount: event.returnValues.newReputation });
      })

      setMembers(members);
    });
  }, [getConnection, connected])

  return (
    <Flex pt={2} direction="column" h="100vh">
      <Flex mx={4} justifyContent="space-between">
        <Box>
          <NextLink href="/">
            <Logo width="150px" height="45px" />
          </NextLink>
        </Box>

        <Connect connected={connected} connect={connect} disconnect={disconnect} getConnection={getConnection} />
      </Flex>

      <Divider mt={2} />

      <Box h="100%" pt={6} px={4} bgGradient='linear(to-r, cyan.50, gray.100, blue.50)'>
        <Box>
          <Center>
            <Flex direction="column" mb={2}>
              <Box ml={4}>
                <Heading fontWeight="medium" size="lg">Leaderboard</Heading>
              </Box>

              <Stack w="50vw" spacing="4">
                {members.length > 0 && members.map((member) => (
                  <Card px={4} py={2} key={member.logIndex}>
                    <Flex direction="row" justify="space-between" spacing="4">
                      <HStack spacing="3">
                        <Avatar src="" boxSize="10" />
                        <Box>
                          <Text fontWeight="medium" color="grey.500">
                            {member.address}
                          </Text>
                        </Box>
                      </HStack>
                      <Box p={2}>
                        <Text fontWeight="bold" fontSize="lg">12</Text>
                      </Box>
                    </Flex>
                  </Card>
                ))}
                {members.length === 0 && (
                  <Center>
                    <Text>No reputation information available</Text>
                  </Center>
                )}
              </Stack>
            </Flex>

          </Center>
        </Box>
      </Box>
    </Flex>
  );
}

export default Leaderboard;
