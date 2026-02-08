import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { CoinsIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { demoTransactions } from '../seeds/transactions';
import { Transaction, columns, csvToArray } from './table-data';
import { toCurrency } from './utils';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Array<Transaction>>([]);
  const [currency, setCurrency] = useState<string>('GBP');
  const [totalFee, setTotalFee] = useState<number>(0);
  const [totalBuy, setTotalBuy] = useState<number>(0);
  const [totalSell, setTotalSell] = useState<number>(0);
  const [owned, setOwned] = useState<{ [key: string]: number }>({});

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files === null) {
      return;
    }

    setUploadedFile(event.target.files[0]);
  };

  const handleSubmit = (): void => {
    if (uploadedFile === null) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (): void => {
      let fileContents = reader.result as string;

      // Trim anything off before the main headers start
      fileContents = fileContents.substring(fileContents.indexOf('Timestamp'));

      // Replace wonky encodings from CSVs
      fileContents = fileContents.replaceAll('Â£', '£');

      setRows(csvToArray(fileContents));
    };
    reader.readAsBinaryString(uploadedFile);
  };

  useEffect(() => {
    if (rows.length === 0) {
      return;
    }

    setCurrency(rows[0].spotPriceCurrency);

    let totalFee: number = 0;
    let totalBuy: number = 0;
    let totalSell: number = 0;
    const owned: { [key: string]: number } = {};

    for (let i = 0; i < rows.length; i++) {
      totalFee += rows[i].fees;

      if (rows[i].type === 'Buy') {
        totalBuy += rows[i].total;
      }

      if (rows[i].type === 'Sell') {
        totalSell += rows[i].total;
      }

      const quantity = rows[i].quantity;

      switch (rows[i].type) {
        case 'Buy':
        case 'Receive':
        case 'Rewards Income':
        case 'Learning Reward':
          if (owned[rows[i].asset] === undefined) {
            owned[rows[i].asset] = quantity;
          } else {
            owned[rows[i].asset] += quantity;
          }
          break;
        case 'Sell':
        case 'Send':
          if (owned[rows[i].asset] === undefined) {
            owned[rows[i].asset] = quantity * -1;
          } else {
            owned[rows[i].asset] -= quantity;
          }
          break;
        case 'Convert':
          // Example: Converted 0.21982944 ETH to 0.21982944 ETH2
          let notes = rows[i].notes;

          // Trim "Converted "
          notes = notes.substring(10);

          const [from, to] = notes.split(' to ');
          const [fromAmount, fromUnit] = from.split(' ');
          const [toAmount, toUnit] = to.split(' ');

          if (owned[fromUnit] === undefined) {
            owned[fromUnit] = parseFloat(fromAmount) * -1;
          } else {
            owned[fromUnit] -= parseFloat(fromAmount);
          }

          if (owned[toUnit] === undefined) {
            owned[toUnit] = parseFloat(toAmount);
          } else {
            owned[toUnit] += parseFloat(toAmount);
          }

          break;
      }
    }

    const currentlyOwned: { [key: string]: number } = {};

    Object.keys(owned).forEach((key) => {
      // Remove miniscule amounts caused by rounding errors
      if (owned[key] > 0.00000001) {
        currentlyOwned[key] = parseFloat(owned[key].toFixed(8));
      }
    });

    setTotalFee(totalFee);
    setTotalBuy(totalBuy);
    setTotalSell(totalSell);
    setOwned(currentlyOwned);

    window.scroll({
      top: 600,
      left: 0,
      behavior: 'smooth',
    });
  }, [rows]);

  return (
    <main className="p-12">
      <section className="py-12 flex flex-col items-center gap-8">
        <img
          src="logo.webp"
          width="63px"
          height="63px"
          alt="Two arrows spinning around a play button, symbolising replaying history"
        />

        <h1 className="text-4xl font-bold text-center">Coinbase Recap</h1>

        <p className="text-2xl text-muted-foreground text-center">
          View a breakdown of your Coinbase transaction history
        </p>

        <p className="max-w-2xl text-center">
          To get started you will need to export your full Coinbase transaction
          history as a CSV file. You can find instructions on how to do this on
          the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://help.coinbase.com/en/contact-us/support-faq/coinbase/how-to-view-your-balance-and-transactions"
            className="text-primary underline hover:no-underline"
          >
            official Coinbase support site&nbsp;
            <ExternalLinkIcon className="inline h-4 w-4" />
          </a>
          .
        </p>

        <div className="w-full max-w-sm">
          <Label htmlFor="csv">Upload your transaction history</Label>
          <Input
            id="csv"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex gap-8">
          <Button disabled={uploadedFile === null} onClick={handleSubmit}>
            Generate recap
          </Button>

          <Button variant="secondary" onClick={() => setRows(demoTransactions)}>
            See a demo
          </Button>
        </div>
      </section>

      {rows.length > 0 && (
        <>
          <section className="py-24 flex flex-col gap-8">
            <h2 className="text-3xl font-bold">Your Transactions</h2>

            <DataTable columns={columns} data={rows} />
          </section>

          <section className="py-24 flex flex-col gap-8">
            <h2 className="text-3xl font-bold">Your Recap</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Buy
                  </CardTitle>

                  <MinusIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {toCurrency(totalBuy, currency)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sell
                  </CardTitle>

                  <PlusIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {toCurrency(totalSell, currency)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Fee
                  </CardTitle>

                  <MinusIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {toCurrency(totalFee, currency)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="py-24 flex flex-col gap-8">
            <h2 className="text-3xl font-bold">Currently Owned</h2>

            <div className="grid gap-4 md:grid-cols-3">
              {Object.keys(owned).map((key) => (
                <Card key={key}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{key}</CardTitle>

                    <CoinsIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{owned[key]}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
