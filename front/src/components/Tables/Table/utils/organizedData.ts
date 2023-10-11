import { ITableHeader } from '../types';

type IndexedHeader = {
  [key: string]: ITableHeader;
};

type OrganizedItem = {
  [key: string]: any;
};

export function organizeData(
  data: any[],
  headers: ITableHeader[],
): [OrganizedItem[], IndexedHeader] {
  const indexedHeader: IndexedHeader = {};

  headers.forEach((header) => {
    indexedHeader[header.key] = {
      ...header,
    };
  });

  const headerKeysInOrder = Object.keys(indexedHeader);

  const organizedData = data?.map((item) => {
    const organizedItem: OrganizedItem = {};

    headerKeysInOrder.forEach((key) => {
      organizedItem[key] = item[key];
    });

    organizedItem.$original = item;

    return organizedItem;
  });

  return [organizedData, indexedHeader];
}
