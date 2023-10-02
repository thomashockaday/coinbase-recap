'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContents, setFileContents] = useState<String | null>(null);

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
      setFileContents(reader.result as string);
    };
    reader.readAsBinaryString(uploadedFile);
  };

  return (
    <main className="p-24">
      <section className="py-12 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">Coinbase Recap</h1>

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
            official Coinbase support site
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

      {fileContents !== null && <section>{fileContents}</section>}
    </main>
  );
}
