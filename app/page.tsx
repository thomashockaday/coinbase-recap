'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Header } from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Transaction, columns, csvToArray } from './table-data';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Array<Transaction>>([]);
  const [totalFee, setTotalFee] = useState<number>(0);

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

    let totalFee = 0;
    for (let i = 0; i < rows.length; i++) {
      totalFee += rows[i].fees;
    }

    setTotalFee(totalFee);
  }, [rows]);

  return (
    <>
      <Header />

      <main className="p-12 md:p-24">
        <section className="py-12 flex flex-col items-center gap-8 border-b">
          <Image
            src="/logo.webp"
            width={63}
            height={63}
            alt="Two arrows spinning around a play button, symbolising replaying history"
          />

          <h1 className="text-4xl font-bold text-center">Coinbase Recap</h1>

          <p className="text-2xl text-muted-foreground text-center">
            View a breakdown of your Coinbase transaction history
          </p>

          <p className="max-w-2xl text-center">
            To get started you will need to export your full Coinbase
            transaction history as a CSV file. You can find instructions on how
            to do this on the{' '}
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

          <Button disabled={uploadedFile === null} onClick={handleSubmit}>
            Generate recap
          </Button>
        </section>

        {rows.length > 0 && (
          <>
            <section className="py-12 border-b">
              <DataTable columns={columns} data={rows} />
            </section>

            <section className="py-12">Total fee: {totalFee}</section>
          </>
        )}
      </main>
    </>
  );
}
