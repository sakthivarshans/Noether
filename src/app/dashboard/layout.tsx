import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { PointsProvider } from '@/context/PointsContext';
import { TaskProvider } from '@/context/TaskContext';
import { PomodoroProvider } from '@/context/PomodoroContext';
import FloatingPomodoroTimer from '@/components/dashboard/FloatingPomodoroTimer';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <PointsProvider>
        <TaskProvider>
          <PomodoroProvider>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
              <Sidebar />
              <div className="flex flex-col">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                  {children}
                </main>
              </div>
            </div>
            <FloatingPomodoroTimer />
          </PomodoroProvider>
        </TaskProvider>
      </PointsProvider>
    </FirebaseClientProvider>
  );
}
