import { createSelector } from "@reduxjs/toolkit";
import { selectAccounts, selectGroups } from "./events.slice";
import { selectCurrentGroup } from "./ui.slice";

export const selectCurrentGroupAccounts = createSelector(
  [selectAccounts, selectCurrentGroup],
  (accounts, currentGroup) => {
    return accounts.filter(a => a.groupId === currentGroup);
  }
);
