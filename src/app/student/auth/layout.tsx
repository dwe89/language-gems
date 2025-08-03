export default function StudentAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700">
      {children}
    </div>
  );
}
