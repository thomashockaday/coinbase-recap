import { ColumnDef } from '@tanstack/react-table';

export type Transaction = {
  id: number;
  asset: string;
  fees: string;
  notes: string;
  quantity: string;
  spotPriceCurrency: string;
  spotPriceTransaction: string;
  subtotal: string;
  timestamp: string;
  total: string;
  type: string;
};

export const columns: ColumnDef<Transaction>[] = [
  { accessorKey: 'asset', header: 'Asset' },
  { accessorKey: 'fees', header: 'Fees and/or Spread' },
  { accessorKey: 'notes', header: 'Notes' },
  { accessorKey: 'quantity', header: 'Quantity Transacted' },
  { accessorKey: 'spot-price-currency', header: 'Spot Price Currency' },
  {
    accessorKey: 'spot-price-transaction',
    header: 'Spot Price at Transaction',
  },
  { accessorKey: 'subtotal', header: 'Subtotal' },
  { accessorKey: 'timestamp', header: 'Timestamp' },
  { accessorKey: 'total', header: 'Total (inclusive of fees and/or spread)' },
  { accessorKey: 'type', header: 'Transaction Type' },
];

export const csvToArray = (csvString: string): Array<Transaction> => {
  const rows = csvString
    .trim()
    .split('\n')
    .map((item) => item.split(','));

  // Remove the headers
  rows.shift();

  const transformed = rows.map((item, index) => ({
    id: index,
    asset: item[0],
    fees: item[1],
    notes: item[2],
    quantity: item[3],
    spotPriceCurrency: item[4],
    spotPriceTransaction: item[5],
    subtotal: item[6],
    timestamp: item[7],
    total: item[8],
    type: item[9],
  }));

  return transformed;
};
