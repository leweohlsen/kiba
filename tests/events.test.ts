import type { AnyAction } from "@reduxjs/toolkit";
import reducer, { addGroup } from "../src/app/events.slice";
import { addPerson, initialState } from "../src/app/events.slice";

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

describe("Events Reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it("should add a group and two persons", () => {
    const newGroup = { id: "g0", name: "Crew" };
    const nextState = {
      ...initialState,
      groups: [newGroup],
    };
    expect(reducer(initialState, addGroup(newGroup))).toEqual(nextState);

    const newPerson = { id: "p0", name: "Hein Blöd", groupId: newGroup.id };
    expect(
      reducer(nextState, addPerson(newPerson))
    ).toEqual({
      ...nextState,
      persons: [newPerson],
    });
  });
});
