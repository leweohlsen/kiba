import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import reducer, {
  addGroup,
  addProduct,
  appendTransaction,
  checkout,
} from "../src/app/events.slice";
import { addAccount, initialState } from "../src/app/events.slice";
import { Account, EventPayload, Product } from "../src/app/types";

const events1 = [
  { type: "CREATE_GROUP", payload: { id: "g2", name: "Schiff" } },
  {
    type: "CREATE_ACCOUNT",
    payload: { id: "a5", name: "Hein Blöd", groupId: "g2", balance: 0.03 },
  },
  { type: "DELETE_ACCOUNT", payload: { id: "a5" } },
  { type: "DELETE_GROUP", payload: { id: "g2" } },
];

describe("Event Reducers - Groups, Accounts, Products and Purchases", () => {
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

  const cart0 = { id: "c0", customerId: "a0", product_ids: ["p0", "p1"] };

  it("should return the initial state", () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it("should create a group and two accounts", () => {
    let currentState = reducer(initialState, addGroup(group0));

    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
    });

    currentState = reducer(currentState, addAccount(account0));
    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      accounts: { a0: account0 },
    });

    currentState = reducer(currentState, addAccount(account1));
    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      accounts: { a0: account0, a1: account1 },
    });
  });

  it("should create a product", () => {
    const currentState = reducer(initialState, addProduct(product0));
    expect(currentState).toEqual({
      ...initialState,
      products: { p0: product0 },
    });
  });

  it("should create an account, a two products, checkout both and decrease account balance", () => {
    let currentState = reducer(initialState, addGroup(group0));
    currentState = reducer(currentState, addAccount(account0));
    currentState = reducer(currentState, addProduct(product0));
    currentState = reducer(currentState, addProduct(product1));

    expect(currentState).toEqual({
      ...initialState,
      groups: { g0: group0 },
      accounts: { a0: account0 },
      products: { p0: product0, p1: product1 },
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
    });
  });

  it("should append redux actions to the events array", () => {
    const actionAddGroup = addGroup(group0);
    const actionAddAccount = addAccount(account0);
    const actionAddProduct = addProduct(product0);

    let currentState = reducer(initialState, actionAddGroup);
    currentState = reducer(currentState, appendTransaction(actionAddGroup));
    currentState = reducer(currentState, actionAddAccount);
    currentState = reducer(currentState, appendTransaction(actionAddAccount));
    currentState = reducer(currentState, actionAddProduct);
    currentState = reducer(currentState, appendTransaction(actionAddProduct));

    expect(currentState).toEqual({
      groups: { g0: group0 },
      accounts: { a0: account0 },
      products: { p0: product0 },
      events: [actionAddGroup, actionAddAccount, actionAddProduct],
    });
  });
});


describe("Replaying events", () => {
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
        customerId: "a1",
        customPrice: null,
        product_ids: ["p0", "p1", "p4", "p3"],
      },
    },
    {
      type: "CREATE_TRANSACTION",
      payload: {
        id: "t1",
        customerId: "a0",
        customPrice: null,
        product_ids: ["p4", "p0", "p4"],
      },
    },
    {
      type: "CREATE_TRANSACTION",
      payload: {
        id: "t2",
        customerId: "a2",
        customPrice: 0.3,
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
        customerId: "a4",
        customPrice: null,
        product_ids: ["p3", "p3", "p3", "p3", "p3"],
      },
    },
  ];
});
