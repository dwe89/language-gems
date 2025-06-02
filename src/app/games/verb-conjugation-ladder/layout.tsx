export default function VerbConjugationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
} 