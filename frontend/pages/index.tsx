import nextBase64 from "next-base64";


import NextLink from 'next/link';
import {
  Box,
  Container,
  Flex,
  HStack,
  Input,
  Link,
} from '@chakra-ui/react';
import { AbiItem } from 'web3-utils';
import { Formik, FormikProps } from "formik";

import { useWeb3 } from "@/hooks/useWeb3";
import Logo from "@/components/Logo";
import SubmissionContractABI from "@/abis/Submission.json";
import SubmissionLiveFeed from "@/components/SubmissionLiveFeed";
import { useRouter } from "next/router";
import Connect from "@/components/Connect";


type Form = {
  observable: string;
};

function Home() {
  const router = useRouter();
  const { connected, connect, disconnect, getConnection } = useWeb3();

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
            <Connect connected={connected} connect={connect} disconnect={disconnect} />
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
    </Flex>
  );
}

export default Home;
