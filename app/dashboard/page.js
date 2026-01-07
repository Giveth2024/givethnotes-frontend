import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faCode, 
  faLayerGroup, 
  faChartLine,
  faArrowRightFromBracket // Icon for sign out
} from '@fortawesome/free-solid-svg-icons';
import { SignOutButton } from "@clerk/nextjs"; // Import Clerk Button

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-6 hidden md:block">
        <h2 className="text-xl font-bold text-amber-400 mb-10">MasteryDB</h2>
        <nav className="space-y-6">
          <a href="#" className="flex items-center gap-3 text-amber-400 font-medium">
            <FontAwesomeIcon icon={faLayerGroup} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <FontAwesomeIcon icon={faBook} /> My Blocks
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
            <FontAwesomeIcon icon={faCode} /> Code Snippets
          </a>

          <div className="pt-10 border-t border-gray-800">
            {/* --- CLERK SIGN OUT BUTTON --- */}
            <SignOutButton>
              <button className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full">
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <span>Sign Out</span>
              </button>
            </SignOutButton>
            {/* ----------------------------- */}
          </div>
        </nav>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Giveth</h1>
            <p className="text-gray-400 mt-1">Ready to document your next breakthrough?</p>
          </div>
          
          {/* Quick Access Sign Out for Mobile/Testing */}
          <div className="flex items-center gap-4">
             <SignOutButton>
                <button className="md:hidden px-3 py-1 text-xs border border-red-500 text-red-500 rounded">
                  Logout
                </button>
             </SignOutButton>
             <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold">
               G
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Blocks Created" value="24" icon={faLayerGroup} />
          <StatCard title="Days Streak" value="12" icon={faChartLine} />
          <StatCard title="Concepts Mastered" value="8" icon={faBook} />
        </div>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Blocks</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black rounded-lg border border-gray-800">
                <span>Understanding Next.js Middleware</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">{title}</span>
        <FontAwesomeIcon icon={icon} className="text-amber-400" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}