import { v4 as uuid } from "uuid";
import { assign, createMachine } from "xstate";

type ElevatorEvent = { type: "CALL"; value: number };

type Call = {
  id: string;
  floor: number;
};

type ElevatorContext = {
  floor: number;
  queue: Call[];
};

type ElevatorTypestate =
  | {
      value: "idle";
      context: ElevatorContext;
    }
  | {
      value: "running";
      context: ElevatorContext;
    }
  | {
      value: "doorClose";
      context: ElevatorContext;
    }
  | {
      value: "doorOpen";
      context: ElevatorContext;
    };

const addCallToQueue = (floor: number) => ({ floor, id: uuid() });

export const elevatorMachine = createMachine<
  ElevatorContext,
  ElevatorEvent,
  ElevatorTypestate
>(
  {
    id: "elevator",
    initial: "idle",
    context: {
      floor: 0,
      queue: [],
    },
    states: {
      idle: {
        on: {
          CALL: {
            actions: assign({
              queue: (_, event) => [addCallToQueue(event.value)],
            }),
            target: "running",
          },
        },
      },
      running: {
        after: {
          1000: [
            {
              target: "doorOpen",
              cond: {
                type: "calledFloor",
              },
            },
            {
              actions: assign({
                floor: (context) => context.floor - 1,
              }),
              target: "running",
              cond: {
                type: "callLower",
              },
            },
            {
              actions: assign({
                floor: (context) => context.floor + 1,
              }),
              target: "running",
              cond: {
                type: "callHigher",
              },
            },
            {
              target: "idle",
              cond: {
                type: "toRetire",
              },
            },
            {
              actions: assign({
                queue: () => [addCallToQueue(0)],
              }),
              target: "running",
              cond: {
                type: "toReturn",
              },
            },
          ],
        },
        on: {
          CALL: {
            actions: assign({
              queue: (context, event) => [
                ...context.queue,
                addCallToQueue(event.value),
              ],
            }),
            target: "running",
          },
        },
      },
      doorOpen: {
        after: {
          2000: {
            actions: assign({
              queue: (context) =>
                context.queue.filter((call) => call.floor !== context.floor),
            }),
            target: "doorClose",
          },
        },
      },
      doorClose: {
        after: {
          1000: { target: "running" },
        },
      },
    },
  },
  {
    guards: {
      callHigher: (context) => {
        return (
          context.queue.find((call) => call.floor > context.floor) !== undefined
        );
      },
      callLower: (context) => {
        return (
          context.queue.find((call) => call.floor < context.floor) !== undefined
        );
      },
      calledFloor: (context) => {
        return (
          context.queue.find((call) => call.floor === context.floor) !==
          undefined
        );
      },
      toReturn: (context) => {
        return context.queue.length === 0 && context.floor !== 0;
      },
      toRetire: (context) => {
        return context.queue.length === 0 && context.floor === 0;
      },
    },
  }
);
