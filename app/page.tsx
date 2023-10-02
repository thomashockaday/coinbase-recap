import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="p-24">
      <section className="py-12 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">Coinbase Recap</h1>
        <p className="text-2xl text-muted-foreground">
          View a breakdown of your Coinbase transaction history by uploading a
          CSV
        </p>
      </section>
      <div className="flex gap-6 items-center justify-center">
        <Button>Lets go</Button>
      </div>
    </main>
  );
}
