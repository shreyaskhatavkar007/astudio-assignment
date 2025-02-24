import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <nav className="flex space-x-4 bg-grey p-4 rounded-lg shadow-lg">
        <Link
          href="/users"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Users
        </Link>
        <Link
          href="/products"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Products
        </Link>
      </nav>
    </div>
  );
}
