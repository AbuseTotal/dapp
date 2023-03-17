import NextLink from "next/link";
import { ZkConnectClientConfig, ZkConnectResponse } from "@sismo-core/zk-connect-react";
import { ZkConnect } from "@sismo-core/zk-connect-client";
import axios from 'axios';

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Center,
  Divider,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'

import Logo from "@/components/Logo";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";


const config: ZkConnectClientConfig = {
	appId: process.env.NEXT_PUBLIC_SISMO_APP_ID ?? "", 
	devMode: {
		// will use the Dev Sismo Data Vault https://dev.vault-beta.sismo.io
		// active the devMode only in your dev environment 
		enabled: true, 
		// overrides any group with these addresses
		devAddresses: [ 
		      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
		],
		// you can also customize values
		// devAddresses?: {
		//   "0x123...abc": 2,
		//   "0x456...efa": 3
		// },
	}
}

const zkConnect = ZkConnect(config);

function Providers() {
  const router = useRouter();
  const [hasBeenRedirected, setHasBeenRedirected] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(0);

  const handleZKConnectRequest = () => {
    zkConnect.request({ callbackPath: "/providers" });
  }

  const verifyZKConnectResponse = (zkConnectResponse: ZkConnectResponse) => {
    //Send the response to your server to verify it
    //thanks to the @sismo-core/zk-connect-server package
    //Will see how to do this in next part of this tutorial
    axios
      .post('api/verify', {
        zkConnectResponse,
      })
      .then((res: any) => {
        setIsAuthenticated(1);
      })
      .catch((err: any) => {
        console.log(err.response.data.status);
      });
  };

  useEffect(() => {
    setHasBeenRedirected(router.query.zkConnectResponse !== undefined ? 1 : 2);
    if (!router.query.zkConnectResponse) { return };

    const zkConnectResponse = zkConnect.getResponse();

    if (zkConnectResponse) {
      verifyZKConnectResponse(zkConnectResponse);
    }
  }, [router.query])

  const getSubmissionsWithBounties = useMemo(() => () => {
    return [
      {
        url: "https://things.com",
        counter: 6,
        totalBounty: 320,
      },
      {
        url: "https://stuff.com",
        counter: 21,
        totalBounty: 95,
      },
      {
        url: "https://badbadnotgood.com",
        counter: 4,
        totalBounty: 100,
      },
    ]
  }, []);

  const handleClaim = (url: string) => {
   // TODO: Axios API call
  };

  return (
    <Flex pt={2} px={4} direction="column" h="100vh">
      <NextLink href="/">
        <Logo width="150px" height="45px" />
      </NextLink>

      <Divider mt={2} />

      <Box mt={6}>
        {isAuthenticated === 0 && (
          <Box>
            <Center>
              <Flex mt={12} w="50vw" direction="column" mb={2} alignItems="center">
                <Heading>Authenticate yourself as a provider</Heading>
                <Text mt={1} color="gray.600">You're one step away from being able participate in the community and reduce cybercrime</Text>

                <Box mt={6}>
                  <Button 
                    isLoading={isAuthenticated === 0 && (hasBeenRedirected === 0 || hasBeenRedirected === 1)}
                    colorScheme={isAuthenticated ? "green" : "blue"}
                    variant="outline"
                    onClick={() => handleZKConnectRequest()}
                  >
                    {isAuthenticated ? "Success" : "Sign-in with zkConnect"}
                  </Button>
                </Box>
              </Flex>

            </Center>
          </Box>
        )}

        {isAuthenticated === 1 && (
          <Box>
            <Center>
              <Flex direction="column" mb={2}>
                <Box>
                  <Heading fontWeight="medium" size="lg">Submissions pending action</Heading>
                </Box>

                <SimpleGrid mt={6} py={1} px={4} columns={12} spacing={3}>
                  <GridItem colSpan={6}>
                    <Text>URL</Text>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Text># of submissions</Text>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Text>Total Bounty</Text>
                  </GridItem>
                  <GridItem colSpan={2}>
                  </GridItem>
                </SimpleGrid>

                <Stack w="50vw" spacing="4" mt={2}>
                  {getSubmissionsWithBounties().length > 0 && getSubmissionsWithBounties().map((submission) => (
                    <Card py={2} px={4} key={submission.url}>
                      <SimpleGrid columns={12} spacing={3}>
                        <GridItem display="flex" alignItems="center" colSpan={6}>
                          <Text h="fit-content">{submission.url}</Text>
                        </GridItem>
                        <GridItem display="flex" alignItems="center" colSpan={2}>
                          <Text h="fit-content">{submission.counter}</Text>
                        </GridItem>
                        <GridItem display="flex" alignItems="center" colSpan={2}>
                          <Text h="fit-content">{submission.totalBounty}</Text>
                        </GridItem>
                        <GridItem colSpan={2} display="flex" justifyContent="flex-end">
                          <ButtonGroup size="sm" variant="outline">
                            <Button colorScheme="green" onClick={() => handleClaim(submission.url)}>Claim</Button>
                            <Button colorScheme="blue" onClick={() => router.push(`/takedowns/${submission.url}`)}>Info</Button>
                          </ButtonGroup>
                        </GridItem>
                      </SimpleGrid>
                    </Card>
                  ))}
                  {getSubmissionsWithBounties().length === 0 && (
                    <Center>
                      <Text>No available submissions with bounties</Text>
                    </Center>
                  )}
                </Stack>
              </Flex>
            </Center>
          </Box>
        )}
      </Box>
    </Flex>
  );
}

export default Providers;
