"use client";

import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, ExternalLink, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import type { Payment, PaymentStatus, PlanType } from "@/types/database";

interface PaymentHistoryProps {
  payments: Payment[];
}

const statusConfig: Record<PaymentStatus, { label: string; icon: typeof CheckCircle; className: string }> = {
  completed: {
    label: "Completado",
    icon: CheckCircle,
    className: "text-green-600 bg-green-50",
  },
  pending: {
    label: "Pendiente",
    icon: Clock,
    className: "text-amber-600 bg-amber-50",
  },
  failed: {
    label: "Fallido",
    icon: XCircle,
    className: "text-red-600 bg-red-50",
  },
  refunded: {
    label: "Reembolsado",
    icon: RefreshCw,
    className: "text-blue-600 bg-blue-50",
  },
};

const planNames: Record<PlanType, string> = {
  ocasional: "Pack Ocasional",
  agencia: "Plan Agencia",
};

function formatAmount(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")}€`;
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="border border-neutral-200 bg-white p-8 text-center">
        <p className="text-[15px] text-neutral-500">
          No tienes pagos registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-6 py-3 text-left text-[12px] font-medium text-neutral-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-medium text-neutral-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-medium text-neutral-500 uppercase tracking-wider">
                Importe
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-medium text-neutral-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-medium text-neutral-500 uppercase tracking-wider">
                Factura
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {payments.map((payment) => {
              const status = statusConfig[payment.status];
              const StatusIcon = status.icon;

              return (
                <tr key={payment.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-[14px] text-neutral-900">
                        {format(new Date(payment.created_at), "d MMM yyyy", { locale: es })}
                      </p>
                      <p className="text-[13px] text-neutral-500">
                        {format(new Date(payment.created_at), "HH:mm")}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[14px] text-neutral-900">
                      {planNames[payment.plan_type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[14px] font-medium text-neutral-900">
                      {formatAmount(payment.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium ${status.className}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {payment.invoice_url ? (
                      <a
                        href={payment.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Descargar
                      </a>
                    ) : (
                      <span className="text-[13px] text-neutral-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-neutral-100">
        {payments.map((payment) => {
          const status = statusConfig[payment.status];
          const StatusIcon = status.icon;

          return (
            <div key={payment.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[14px] font-medium text-neutral-900">
                    {planNames[payment.plan_type]}
                  </p>
                  <p className="text-[13px] text-neutral-500">
                    {format(new Date(payment.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                  </p>
                </div>
                <span className="text-[15px] font-medium text-neutral-900">
                  {formatAmount(payment.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium ${status.className}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
                {payment.invoice_url && (
                  <a
                    href={payment.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-neutral-600"
                  >
                    <Download className="h-4 w-4" />
                    Factura
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
