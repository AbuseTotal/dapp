import NextLink from "next/link";
import {
  Box,
  GridItem,
  SimpleGrid,
  Tooltip,
  Stack,
  Text,
  useBreakpointValue,
  Flex,
  Card,
  Divider,
  Heading,
  CardHeader,
  CardBody,
  Button,
  VStack,
  Center,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

import GenericInfoCard from "@/components/GenericInfoCard";
import Logo from "@/components/Logo";

const scans = {
  title: "Latest scan",
  server: "Germany GE-01",
  data: [
    {
      title: "DNS",
      copy: true,
      colorScheme: "gray",
      variant: "outline",
      data: [
        "192.168.1.1",
        "192.168.1.2",
        "192.168.1.3",
        "192.168.1.4",
        "192.168.1.5",
      ],
    },

    {
      title: "NameServers",
      copy: true,
      colorScheme: "gray",
      variant: "outline",
      data: ["ns1.example.com", "ns3.example.com"],
    },
    {
      title: "Resolution",
      data: "1920x1080",
    },
    {
      title: "HTTP Status",
      colorScheme: "green",
      variant: "outline",
      data: "200",
    },
    {
      title: "User Agent",
      copy: true,
      data: "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1",
    },
  ],
};

const overview = {
  title: "Overview",
  data: [
    {
      title: "Domain",
      data: "abusiatotal.com",
    },
    {
      title: "Report Date",
      data: new Date().toDateString(),
    },
    {
      title: "Takedown Request Date",
      data: new Date().toDateString(),
    },
    {
      title: "Liveliness Status",
      colorScheme: "green",
      variant: "outline",
      data: "Online",
    },
    {
      title: "Provider",
      data: "OVH",
    },
  ],
};

const timer = {
  title: "Time Remaining",
};

const votes = [
 {
  id: 1,
  address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  malicious: true,
 },
 {
  id: 2,
  address: "0xB6d2CCB1c17246CB025843f0E7d658Ead8345305",
  malicious: false,
 },
 {
  id: 2,
  address: "0x6b17dabdc7f96689c6052CcAB3De975B9AD532d3",
  malicious: false,
 },
];

function Observable() {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 3);


  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Flex pt={2} px={4} direction="column" h="100vh">
      <NextLink href="/">
        <Logo width="150px" height="45px" />
      </NextLink>

      <Divider mt={2} />

      <Box mt={6} px={6}>
        <SimpleGrid
          columns={12}
          gap={4}
          templateColumns={{ base: "repeat(6, 1fr)", md: "repeat(12, 1fr)" }}
          width="100%"
        >
          <GridItem colSpan={{ base: 12, lg: 8 }} h="100%">
            <Flex
              h="100%"
              bg="bg-surface"
              px={{ base: "4", md: "6" }}
              py="5"
              boxShadow="sm"
              borderTopWidth="4px"
              borderColor="brand.50"
              direction="column"
              justifyContent="space-between"
            >
              <Stack minH="70px" spacing="1">
                <Text fontSize="lg" fontWeight="medium">
                  Observable
                </Text>
                <Text color="muted" fontSize="sm">
                  This URL has been submitted 56 times and has been voted on 41 times.
                </Text>
              </Stack>

              <Stack direction="row" spacing={4} alignItems="center">
                <Tooltip
                  label="Attention: This URL contains a reported malicious link"
                  placement="right"
                  borderRadius="10px"
                >
                  <FontAwesomeIcon
                    icon={faLink}
                    size={isMobile ? "xs" : "sm"}
                  />
                </Tooltip>
                <Tooltip
                  label="Click to copy"
                  placement="right"
                  borderRadius="10px"
                >
                  <Text fontWeight="medium">https://google.com</Text>
                </Tooltip>
              </Stack>
            </Flex>
          </GridItem>

          <GridItem colSpan={{ base: 12, lg: 4 }}>
            <Box
              bg="bg-surface"
              px={{ base: "4", md: "6" }}
              py="5"
              boxShadow="sm"
              borderTopWidth="4px"
              borderColor="red.400"
              h="100%"
            >
              <Text fontSize="lg" fontWeight="medium">
                Community consensus
              </Text>
              <Center mt={4}>
                <Text fontSize="xl" fontWeight="semibold" textTransform="uppercase">
                  Malicious
                </Text>
              </Center>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 12, lg: 6 }}>
            <Card boxShadow="md" h="100%">
              <CardHeader>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading w="fit-content" size="md">Votes</Heading>
                  <Button variant="outline" colorScheme="blue">Add</Button>
                </Flex>
              </CardHeader>

              <CardBody>
                <VStack divider={<Divider />}>
                  {votes.map(bounty => (
                    <SimpleGrid w="100%" key={bounty.id} columns={12}>
                      <GridItem colSpan={6}>
                        {bounty.address}
                      </GridItem>
                      <GridItem colSpan={4} display="flex" justifyContent="center">
                        <Text fontWeight="semibold">
                          <FontAwesomeIcon
                            icon={bounty.malicious ? faThumbsDown : faThumbsUp}
                            color={bounty.malicious ? "red" : "green"}
                          />
                        </Text>
                      </GridItem>
                      <GridItem colSpan={2}>
                        5 seconds ago
                      </GridItem>
                    </SimpleGrid>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem colSpan={{ base: 12, lg: 6 }}>
            <Box>
              <GenericInfoCard
                title={overview.title}
                data={overview.data}
                boxShadow="md"
              />
            </Box>

            <Box mt={2}>
              <GenericInfoCard
                title={scans.title ? scans.title : undefined}
                data={scans.data}
                boxShadow="md"
                lastUpdatedAt="Fri Mar 17 2023 22:43:28 GMT+0000 (Western European Standard Time)"
                server={scans.server}
              />
            </Box>
          </GridItem>


        </SimpleGrid>
      </Box>
    </Flex>
  );
}

export default Observable;
