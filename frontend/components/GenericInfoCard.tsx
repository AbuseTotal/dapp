import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Text,
  Heading,
  Flex,
  EffectProps,
  SpaceProps,
  Badge,
  Tooltip,
  useClipboard,
  CardFooter,
  TagLeftIcon,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer, faClipboard } from '@fortawesome/free-solid-svg-icons'

type DataProps = {
  copy?: boolean;
  title: string;
  colorScheme?: string;
  variant?: string;
  data: string[] | string;
};

type ListCardProps = {
  title?: string;
  data: DataProps[];
  lastUpdatedAt?: string;
  server?: string;
  boxShadow?: EffectProps["boxShadow"];
  py?: SpaceProps["py"];
  px?: SpaceProps["px"];
};

enum DataType {
  URL = "url",
  SHORT_STRING = "short-string",
  LONG_STRING = "long-string",
}

const getType = (value: string) => {
  const regex = /http/g;
  const size: DataType =
    value.length > 15 ? DataType.LONG_STRING : DataType.SHORT_STRING;

  return value.match(regex) ? DataType.URL : size;
};

const BadgeComponent: React.FC<any> = ({
  data,
  colorScheme,
  variant = "none",
  copy,
  onCopy,
}) =>
  // eslint-disable-next-line no-nested-ternary
  getType(data) !== DataType.SHORT_STRING ? (
    <Tooltip
      label="Click to copy"
      placement="top-start"
      borderRadius="10px"
    >
      <Badge
        colorScheme={colorScheme}
        variant={variant}
        onClick={() => onCopy(data)}
      >
        <Tag size="md" variant="none" colorScheme="none">
          <TagLeftIcon
            name="expand"
            icon={faClipboard}
            as={FontAwesomeIcon}
          />
          <TagLabel>Click to copy</TagLabel>
        </Tag>
      </Badge>
    </Tooltip>
  ) : copy ? (
    <Tooltip
      label="Click to copy"
      placement="top-start"
      borderRadius="10px"
    >
      <Badge
        colorScheme={colorScheme}
        variant={variant}
        onClick={() => onCopy(data)}
      >
        {data}
      </Badge>
    </Tooltip>
  ) : (
    <Badge colorScheme={colorScheme} variant={variant}>
      {data}
    </Badge>
  );

function ListCard({
  title,
  lastUpdatedAt,
  server,
  data,
  boxShadow,
  py = "2",
  px = "4",
}: ListCardProps) {
  const { onCopy, setValue } = useClipboard("");

  const setClipboard = (clipboard: string) => {
    onCopy();
    setValue(clipboard);
  };
  return (
    <Card boxShadow={boxShadow} h="100%">
      {title && (
        <CardHeader>
          <Heading size="md">{title}</Heading>
        </CardHeader>
      )}

      <CardBody py={py} px={px}>
        <Stack divider={<StackDivider />} spacing="2">
          {Object.entries(data).map(([key, value], index) => (
            <Flex key={index} justify="space-between">
              <Text fontSize="sm" textAlign={{ base: "left", sm: "end" }}>
                {value.title}
              </Text>
              <Stack direction="row">
                {Array.isArray(value.data) ? (
                  value.data.map((content, idx) => (
                    <BadgeComponent
                      key={`${value.title}-${idx}`}
                      colorScheme={value.colorScheme}
                      variant={value.variant}
                      data={value.data[idx]}
                      copy={value.copy}
                      onCopy={() => setClipboard(content)}
                    />
                  ))
                ) : (
                  <BadgeComponent
                    key={`${value.title}-${index}`}
                    colorScheme={value.colorScheme}
                    variant={value.variant}
                    data={value.data}
                    copy={value.copy}
                    onCopy={() => setClipboard(String(value.data))}
                  />
                )}
              </Stack>
            </Flex>
          ))}
        </Stack>
      </CardBody>
      {lastUpdatedAt && (
        <CardFooter w="full" py={py} px={px}>
          <Flex
            direction={{ base: "row", sm: "row" }}
            w="full"
            justifyContent={server ? "space-between" : "flex-end"}
          >
            {server && (
              <Tag size="md" variant="subtle" colorScheme="gray">
                <TagLeftIcon
                  boxSize="12px"
                  name="expand"
                  icon={faServer}
                  as={FontAwesomeIcon}
                />
                <TagLabel>{server}</TagLabel>
              </Tag>
            )}
            <Text fontSize="xs" color="grey" alignSelf="center">
              {lastUpdatedAt}
            </Text>
          </Flex>
        </CardFooter>
      )}
    </Card>
  );
}

export default ListCard;
export type { ListCardProps };
