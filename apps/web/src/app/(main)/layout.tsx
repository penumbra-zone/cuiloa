export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-primary/60 pt-8 rounded-lg border">
      {children}
    </div>
  );
}
