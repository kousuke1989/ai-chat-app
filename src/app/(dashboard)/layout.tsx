// src/app/(dashboard)/layout.tsx
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full bg-blue-300">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto relative bg-blue-300">
          {children}
        </main>
      </div>
    </div>
  );
}
