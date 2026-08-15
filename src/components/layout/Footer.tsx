import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-800 py-12 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-xl font-bold">Task Pilot</span>
            </div>
            <p className="text-slate-500">
              The visual way to manage any project, workflow, or team.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/pricing" className="hover:text-slate-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-slate-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Status
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Task Pilot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
