import { useState, useEffect } from "react";
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Skeleton,
  Text,
} from "@chakra-ui/react";

type BountyTimeProps = {
  title: string;
  date: Date;
  border?: boolean;
};

function BountyTime({ title, date, border = false }: BountyTimeProps) {
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = date.getTime() - now;
      setRemainingTime(distance);
      setLoading(false);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date, loading]);

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const totalHours = days * 24 + hours;
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return (
    <Stat borderWidth={border ? "1px" : undefined} borderRadius="lg" p={2}>
      <Flex direction="column">
        <StatLabel fontSize="lg">{title}</StatLabel>
        <Box>
          <Skeleton
            isLoaded={!loading}
            p={2}
            startColor="gray.200"
            endColor="gray.100"
            speed={1}
          >
            <StatNumber fontSize="2xl" textAlign="center">
              {days < 3
                ? `${totalHours}:${minutes}:${seconds}`
                : `${days} days ${hours}:${minutes}:${seconds}`}
            </StatNumber>
          </Skeleton>
        </Box>
        <Text alignSelf="flex-end" fontSize="xs">
          Bounty ends {date.toDateString()}
        </Text>
      </Flex>
    </Stat>
  );
}

export default BountyTime;
export type { BountyTimeProps };
