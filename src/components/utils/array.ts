export const removeElementInList = <T>(list: T[], element: T) => {
  const updatedList = [...list];
  const index = updatedList.findIndex((_element) => _element === element);
  if (index !== -1) {
    updatedList.splice(index, 1);
  }

  return updatedList;
};

export function sumField<T>(arr: T[], fieldName: keyof T): number {
  return arr.reduce((total, obj) => total + (obj[fieldName] as number), 0);
}

export function sortByKey<T>(
  arr: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc",
): T[] {
  const sortOrder = order === "asc" ? 1 : -1;

  return arr.slice().sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) {
      return -1 * sortOrder;
    } else if (valueA > valueB) {
      return 1 * sortOrder;
    } else {
      return 0;
    }
  });
}

export const updateObjectInList = <T, K extends keyof T>(
  list: T[],
  obj: T,
  key: K,
  shouldAdd: boolean = false,
): T[] => {
  const updatedList = [...list];

  const index = updatedList.findIndex((elm) => elm[key] === obj[key]);

  if (index !== -1) {
    updatedList[index] = { ...updatedList[index], ...obj };
  } else {
    if (shouldAdd) {
      updatedList.unshift(obj);
    }
  }

  return updatedList;
};

export const removeObjectInList = <T, K extends keyof T>(
  list: T[],
  obj: T,
  key: K,
): T[] => {
  const updatedList = [...list];

  const index = updatedList.findIndex((elm) => elm[key] === obj[key]);

  if (index !== -1) {
    updatedList.splice(index, 1);
  }

  return updatedList;
};

export const addOrRemoveFromList = <T>(list: T[], value: T) => {
  const copy = [...list];
  const idx = list.findIndex((e) => e === value);
  idx === -1 ? copy.push(value) : copy.splice(idx, 1);
  return copy;
};

export function getIdsByParent<T, K extends keyof T>(
  objects: T[],
  parentName: K,
  parentKey: K,
  childKey: K,
) {
  return objects
    .filter((obj) => String(obj[parentName]) === String(parentKey))
    .map((obj) => obj[childKey]);
}
