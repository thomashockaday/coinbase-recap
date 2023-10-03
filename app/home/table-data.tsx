import { Button } from '@/components/ui/button';
import { toCurrency } from '@/lib/utils';
import { Column, ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { ReactElement } from 'react';

export type Transaction = {
  id: number;
  timestamp: string;
  type: string;
  asset: string;
  quantity: number;
  spotPriceCurrency: string;
  spotPriceTransaction: number;
  subtotal: number;
  total: number;
  fees: number;
  notes: string;
};

const formatCellAsCurrency = (
  row: Row<Transaction>,
  cell: string
): ReactElement => {
  const formatted = toCurrency(
    row.getValue(cell),
    row.getValue('spotPriceCurrency')
  );

  return <div className="text-right">{formatted}</div>;
};

const sortableHeader = (
  column: Column<Transaction>,
  text: string,
  isCurrency: boolean = false
): ReactElement => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    <div className={isCurrency ? 'text-right' : ''}>{text}</div>

    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'timestamp',
    header: ({ column }): ReactElement => sortableHeader(column, 'Timestamp'),
  },
  { accessorKey: 'type', header: 'Transaction Type' },
  { accessorKey: 'asset', header: 'Asset' },
  { accessorKey: 'quantity', header: 'Quantity Transacted' },
  { accessorKey: 'spotPriceCurrency', header: 'Spot Price Currency' },
  {
    accessorKey: 'spotPriceTransaction',
    header: (): ReactElement => (
      <div className="text-right">Spot Price at Transaction</div>
    ),
    cell: ({ row }): ReactElement =>
      formatCellAsCurrency(row, 'spotPriceTransaction'),
  },
  {
    accessorKey: 'subtotal',
    header: (): ReactElement => <div className="text-right">Subtotal</div>,
    cell: ({ row }): ReactElement => formatCellAsCurrency(row, 'subtotal'),
  },
  {
    accessorKey: 'total',
    header: ({ column }): ReactElement =>
      sortableHeader(column, 'Total (inclusive of fees and/or spread)', true),
    cell: ({ row }): ReactElement => formatCellAsCurrency(row, 'total'),
  },
  {
    accessorKey: 'fees',
    header: (): ReactElement => (
      <div className="text-right">Fees and/or Spread</div>
    ),
    cell: ({ row }): ReactElement => formatCellAsCurrency(row, 'fees'),
  },
  { accessorKey: 'notes', header: 'Notes' },
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
    timestamp: item[0],
    type: item[1],
    asset: item[2],
    quantity: parseFloat(item[3]),
    spotPriceCurrency: item[4],
    spotPriceTransaction: parseFloat(item[5]),
    subtotal: isNaN(parseFloat(item[6])) ? 0 : parseFloat(item[6]),
    total: isNaN(parseFloat(item[7])) ? 0 : parseFloat(item[7]),
    fees: isNaN(parseFloat(item[8])) ? 0 : parseFloat(item[8]),
    notes: item[9],
  }));

  return transformed;
};
