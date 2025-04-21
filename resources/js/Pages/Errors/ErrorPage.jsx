import { Link } from '@inertiajs/react';

export default function ErrorPage({ status }) {
  const titles = {
    503: '503: Service Unavailable',
    500: '500: Server Error',
    404: '404: Page Not Found',
    403: '403: Forbidden',
  };
  const descriptions = {
    503: 'Sorry, we’re doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you’re looking for could not be found.',
    403: 'Oops! You don’t have permission to see this.',
  };

  const title = titles[status] || 'Oops!';
  const description = descriptions[status] || 'Something unexpected happened.';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        {/* Font Awesome icon */}
        <i className="fas fa-exclamation-triangle text-red-500 text-6xl mb-4" />

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
