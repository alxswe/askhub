import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <Header />
      <div className="sm:py-4 lg:py-10">{children}</div>
    </div>
  );
}
