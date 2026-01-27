import { AccountNav } from "@/components/account-nav";

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AccountNav />
      {children}
    </div>
  );
}
