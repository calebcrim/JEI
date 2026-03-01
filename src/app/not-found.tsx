import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h1>
      <p className="text-sm text-text-secondary mb-6">
        The page you are looking for does not exist in this database.
      </p>
      <Link
        href="/"
        className="text-sm text-accent-blue hover:text-accent-blueHover transition-colors"
      >
        ← Return to home
      </Link>
    </div>
  );
}
