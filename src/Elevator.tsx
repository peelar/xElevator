import {
  Container,
  Divider,
  Grid,
  Heading,
  Stack,
  Button,
} from "@chakra-ui/react";
import { Tag } from "@chakra-ui/tag";
import { useMachine } from "@xstate/react";
import { elevatorMachine } from "./Elevator.machine";

export const Elevator = (): JSX.Element => {
  const [state, send] = useMachine(elevatorMachine, { devTools: true });

  return (
    <Container maxW="lg" centerContent>
      <Stack width="100%" spacing={8} my="6">
        <Heading>State</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={5}>
          <Tag
            display="flex"
            justifyContent="center"
            alignItems="center"
            colorScheme="teal"
            size="lg"
            variant="solid"
          >
            {state.value}
          </Tag>
          <Tag
            display="flex"
            justifyContent="center"
            alignItems="center"
            colorScheme="blue"
            size="lg"
            variant="solid"
          >
            {`Floor: ${state.context.floor}`}
          </Tag>
          <Tag
            display="flex"
            justifyContent="center"
            alignItems="center"
            colorScheme="purple"
            size="lg"
            variant="solid"
          >
            {`Queue: ${state.context.queue.map((item) => item.floor)}`}
          </Tag>
        </Grid>
        <Divider />
        <Heading>Elevator</Heading>
        <Stack spacing={4}>
          <Button
            size="lg"
            bgColor="gray.600"
            onClick={() => send({ type: "CALL", value: 3 })}
          >
            3rd floor
          </Button>
          <Button
            size="lg"
            bgColor="gray.400"
            onClick={() => send({ type: "CALL", value: 2 })}
          >
            2nd floor
          </Button>
          <Button
            size="lg"
            bgColor="gray.200"
            onClick={() => send({ type: "CALL", value: 1 })}
          >
            1st floor
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
