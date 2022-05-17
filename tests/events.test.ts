import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import reducer, {
  addGroup,
  addProduct,
  checkout,
} from "../src/app/events.slice";
import { addAccount, initialState } from "../src/app/events.slice";
import { Account, EventPayload, Product } from "../src/app/types";

const events = [
  {
    type: "CREATE_PRODUCT",
    payload: { id: "p0", name: "Fritz Kola", price: 1.5 },
  },
  {
    type: "CREATE_PRODUCT",
    payload: { id: "p1", name: "KitKat Chunky", price: 0.6 },
  },
  {
    type: "CREATE_PRODUCT",
    payload: { id: "p2", name: "Naturals Rosmarin", price: 1.0 },
  },
  {
    type: "CREATE_PRODUCT",
    payload: { id: "p3", name: "Kinder Pingui", price: 0.5 },
  },
  {
    type: "CREATE_PRODUCT",
    payload: { id: "p4", name: "Wassereis", price: 0.3 },
  },
  { type: "CREATE_GROUP", payload: { id: "g0", name: "Zelt 17" } },
  { type: "CREATE_GROUP", payload: { id: "g1", name: "WiZi" } },
  {
    type: "CREATE_ACCOUNT",
    payload: { id: "a0", name: "Lewe Ohlsen", groupId: "g0", balance: 10.0 },
  },
  {
    type: "CREATE_ACCOUNT",
    payload: {
      id: "a1",
      name: "Tjark Knutzen",
      groupId: "g0",
      balance: 100.0,
    },
  },
  {
    type: "CREATE_ACCOUNT",
    payload: {
      id: "a2",
      name: "Lotta Brogmois",
      groupId: "g0",
      balance: 60.0,
    },
  },
  {
    type: "CREATE_ACCOUNT",
    payload: {
      id: "a3",
      name: "Telsche Toben",
      groupId: "g1",
      balance: 500.0,
    },
  },
  {
    type: "CREATE_ACCOUNT",
    payload: {
      id: "a4",
      name: "Dörte Büchner",
      groupId: "g1",
      balance: 500.0,
    },
  },
  {
    type: "CREATE_TRANSACTION",
    payload: {
      id: "t0",
      buyer_id: "a1",
      custom_price: null,
      product_ids: ["p0", "p1", "p4", "p3"],
    },
  },
  {
    type: "CREATE_TRANSACTION",
    payload: {
      id: "t1",
      buyer_id: "a0",
      custom_price: null,
      product_ids: ["p4", "p0", "p4"],
    },
  },
  {
    type: "CREATE_TRANSACTION",
    payload: {
      id: "t2",
      buyer_id: "a2",
      custom_price: 0.3,
      product_ids: ["p0"],
    },
  },
  { type: "EDIT_ACCOUNT", payload: { id: "a2", name: "Lotta Brogmus" } },
  { type: "EDIT_ACCOUNT", payload: { id: "a0", balance: 20 } },
  {
    type: "EDIT_ACCOUNT",
    payload: { id: "a4", groupId: "g0", balance: 100, name: "Dyke Birkner" },
  },
  { type: "EDIT_PRODUCT", payload: { id: "p3", price: 1.5 } },
  {
    type: "CREATE_TRANSACTION",
    payload: {
      id: "t3",
      buyer_id: "a4",
      custom_price: null,
      product_ids: ["p3", "p3", "p3", "p3", "p3"],
    },
  },
];

const events1 = [
  { type: "CREATE_GROUP", payload: { id: "g2", name: "Schiff" } },
  {
    type: "CREATE_ACCOUNT",
    payload: { id: "a5", name: "Hein Blöd", groupId: "g2", balance: 0.03 },
  },
  { type: "DELETE_ACCOUNT", payload: { id: "a5" } },
  { type: "DELETE_GROUP", payload: { id: "g2" } },
];

describe("Event Reducers", () => {
  const group0 = { id: "g0", name: "Crew" };
  const product0 = { id: "p0", name: "Kinder Pingui", price: 0.6 };
  const product1 = { id: "p1", name: "Fritz-Kola", price: 1.5 };
  const account0 = {
    id: "a0",
    name: "Hein Blöd",
    groupId: group0.id,
    balance: 10.0,
  };
  const account1 = {
    id: "a1",
    name: "Käpt'n Blaubär",
    groupId: group0.id,
    balance: 150.0,
  };

  const cart0 = { id: "c0", buyer_id: "a0", product_ids: ["p0", "p1"] };

  it("should return the initial state", () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it("should create a group and two accounts", () => {
    let currentState = reducer(initialState, addGroup(group0));

    const expectedEvents: PayloadAction<EventPayload>[] = [
      {
        payload: {
          id: "g0",
          name: "Crew",
        },
        type: "events/addGroup",
      },
    ];
    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      events: expectedEvents,
    });

    expectedEvents.push({
      payload: {
        balance: 10,
        groupId: "g0",
        id: "a0",
        name: "Hein Blöd",
      },
      type: "events/addAccount",
    });

    currentState = reducer(currentState, addAccount(account0));
    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      accounts: { a0: account0 },
      events: expectedEvents,
    });

    currentState = reducer(currentState, addAccount(account1));
    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      accounts: { a0: account0, a1: account1 },
      events: [
        ...expectedEvents,
        {
          payload: {
            balance: 150,
            groupId: "g0",
            id: "a1",
            name: "Käpt'n Blaubär",
          },
          type: "events/addAccount",
        },
      ],
    });
  });

  it("should create a product", () => {
    const currentState = reducer(initialState, addProduct(product0));
    expect(currentState).toEqual({
      ...initialState,
      products: { p0: product0 },
      events: [
        {
          payload: {
            id: "p0",
            name: "Kinder Pingui",
            price: 0.6,
          },
          type: "events/addProduct",
        },
      ],
    });
  });

  it("should create an account, a two products, checkout both and decrease account balance", () => {
    let currentState = reducer(initialState, addGroup(group0));
    currentState = reducer(currentState, addAccount(account0));
    currentState = reducer(currentState, addProduct(product0));
    currentState = reducer(currentState, addProduct(product1));

    const expectedEvents = [
      {
        payload: {
          id: "g0",
          name: "Crew",
        },
        type: "events/addGroup",
      },
      {
        payload: {
          balance: 10,
          groupId: "g0",
          id: "a0",
          name: "Hein Blöd",
        },
        type: "events/addAccount",
      },
      {
        payload: {
          id: "p0",
          name: "Kinder Pingui",
          price: 0.6,
        },
        type: "events/addProduct",
      },
      {
        payload: {
          id: "p1",
          name: "Fritz-Kola",
          price: 1.5,
        },
        type: "events/addProduct",
      },
    ];

    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      accounts: { a0: account0 },
      products: { p0: product0, p1: product1 },
      events: expectedEvents,
    });

    currentState = reducer(currentState, checkout(cart0));

    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      products: { p0: product0, p1: product1 },
      accounts: {
        a0: {
          ...account0,
          balance: 7.9,
        },
      },
      events: [
        ...expectedEvents,
        {
          payload: {
            buyer_id: "a0",
            id: "c0",
            product_ids: ["p0", "p1"],
          },
          type: "events/checkout",
        },
      ],
    });
  });
});
