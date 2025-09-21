export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Taka&apos;s study room. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}