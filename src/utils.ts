import React from "react";

export const validateEmail = (email: string) => (
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
);

export const genericMemo: <T>(component: T) => T = React.memo;

export const debounce = <T extends Function>(fn: T, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const filterRowItem = (filter: Record<string, string>, obj: Record<string, any>) => {
  const filters = Object.entries(filter);

  const isFilterEmpty = !filters.some(([_, fVal]) => fVal !== '' && fVal !== null && fVal !== undefined);

  if (!filters.length && isFilterEmpty) {
    return true;
  }

  return filters.every(([fKey, fValue]) => {
    if (fValue === '' || fValue === null || fValue === undefined) {
      return true;
    }

    return String(obj[fKey]).toLowerCase().includes(fValue.toLowerCase())
  })
}
