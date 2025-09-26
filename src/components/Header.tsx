import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/assets/img/chacha.JPEG"
            alt="Taka's study room logo"
            width={48}
            height={48}
            className="rounded-full"
            unoptimized
          />
          <h1 className="text-xl font-bold text-gray-900">
            Taka&apos;s study room
          </h1>
        </Link>
      </div>
    </header>
  );
}