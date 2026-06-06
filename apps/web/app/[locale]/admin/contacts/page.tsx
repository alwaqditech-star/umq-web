"use client";

import { useCallback } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { api } from "@/lib/api";
import type { Contact } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/use-locale";
import { useAuthStore } from "@/stores/auth-store";
import { Mail, Phone, Trash2 } from "lucide-react";

const statusOptions = [
  { value: "new", labelAr: "جديدة", labelEn: "New" },
  { value: "in_progress", labelAr: "قيد المعالجة", labelEn: "In progress" },
  { value: "resolved", labelAr: "تم الحل", labelEn: "Resolved" },
  { value: "closed", labelAr: "مغلقة", labelEn: "Closed" },
] as const;

function formatDate(iso: string | undefined, locale: "ar" | "en") {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function statusLabel(status: Contact["status"], locale: "ar" | "en") {
  return (
    statusOptions.find((s) => s.value === status)?.[
      locale === "ar" ? "labelAr" : "labelEn"
    ] ?? status
  );
}

export default function AdminContactsPage() {
  const locale = useLocale();
  const canUpdate = useAuthStore((s) => s.hasPermission("users:update"));
  const canDelete = useAuthStore((s) => s.hasPermission("users:delete"));
  const load = useCallback(
    () => api.contacts.listAdmin?.() ?? api.contacts.getAll(),
    [],
  );
  const { items, setItems, loading, reload } = useAdminList(load);

  const handleDelete = async (row: Contact) => {
    const msg =
      locale === "ar"
        ? `حذف رسالة "${row.subject}"؟`
        : `Delete message "${row.subject}"?`;
    if (!window.confirm(msg)) return;
    await api.contacts.delete(row.id);
    await reload();
  };

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {locale === "ar" ? "رسائل التواصل" : "Contact messages"}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-foreground-muted">
          {locale === "ar" ? "لا توجد رسائل بعد." : "No messages yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {row.name}
                  </p>
                  <p className="mt-1 text-xs text-foreground-muted">
                    {formatDate(row.createdAt, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {canUpdate ? (
                    <select
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
                      value={row.status}
                      onChange={async (e) => {
                        const updated = await api.contacts.update(row.id, {
                          status: e.target.value,
                        });
                        setItems((prev) =>
                          prev.map((c) => (c.id === row.id ? updated : c)),
                        );
                      }}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {locale === "ar" ? s.labelAr : s.labelEn}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge>{statusLabel(row.status, locale)}</Badge>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {locale === "ar" ? "حذف" : "Delete"}
                    </Button>
                  )}
                </div>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-foreground-muted" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                      {locale === "ar" ? "البريد" : "Email"}
                    </dt>
                    <dd>
                      <a
                        href={`mailto:${row.email}`}
                        className="ltr-isolate text-accent hover:underline"
                      >
                        {row.email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-foreground-muted" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                      {locale === "ar" ? "الجوال" : "Phone"}
                    </dt>
                    <dd>
                      {row.phone ? (
                        <a
                          href={`tel:${row.phone}`}
                          className="ltr-isolate font-mono text-foreground hover:text-accent"
                        >
                          {row.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  {locale === "ar" ? "الموضوع" : "Subject"}
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {row.subject}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-border/80 bg-background/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  {locale === "ar" ? "الرسالة" : "Message"}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {row.message}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
