export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-primary/60 px-3 py-4 sm:p-8 rounded-lg border">
      {children}
    </div>
  );
}
