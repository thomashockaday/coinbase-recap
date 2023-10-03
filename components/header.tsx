import { ModeToggle } from './mode-toggle';

export const Header = () => {
  return (
    <header className="p-12 md:px-24 flex align-end justify-end">
      <ModeToggle />
    </header>
  );
};
