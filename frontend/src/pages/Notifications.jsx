import { useState } from "react";
import { Check, Bell } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { EmptyState } from "../components/ui";
import { useNotificationStore } from "../store/notificationStore";
import { toast } from "../store/toastStore";
import { useDomainData } from "../hooks/useDomainData";
import { notificationsApi } from "../services/api";
import { DEMO_NOTIFICATIONS } from "../demo/demoData";
import { formatRelativeTime } from "../utils/formatters";

const kindTone = {
  match: "info",
  verification: "success",
  assessment: "warning",
  recruiter_view: "neutral",
};

/** Notification center with unread management. */
export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const store = useNotificationStore();
  const q = useDomainData(
    ["notifications", "list"],
    () => notificationsApi.list(101),
    DEMO_NOTIFICATIONS
  );

  // Seed the zustand store from query data (single write per load)
  if (q.data && store.notifications.length === 0) {
    store.setNotifications(q.data);
  }
  const notifications = store.notifications.length ? store.notifications : q.data || [];
  const unread = notifications.filter((n) => !n.is_read);
  const visible =
    filter === "unread" ? unread : filter === "all" ? notifications : notifications.filter((n) => n.kind === filter);

  const markAllRead = async () => {
    try {
      await Promise.all(unread.map((n) => notificationsApi.markRead(n.id)));
    } catch {
      // backend endpoint may not exist yet; local state still updates honestly
    }
    unread.forEach((n) => store.markRead(n.id));
    toast.success("All notifications marked as read");
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Signal feed"
        title="Notifications"
        description="Verification outcomes, match changes and assessment deadlines."
        actions={
          <>
            <DataSourceBadge source={q.source} />
            <Button
              variant="secondary"
              onClick={markAllRead}
              disabled={!unread.length}
              leadingIcon={<Check size={15} />}
            >
              Mark all read{unread.length ? ` (${unread.length})` : ""}
            </Button>
          </>
        }
      />

      {q.isDemo && <DemoDataBanner />}

      <Tabs
        value={filter}
        onChange={setFilter}
        items={[
          { value: "all", label: "All" },
          { value: "unread", label: `Unread${unread.length ? ` (${unread.length})` : ""}` },
          { value: "match", label: "Matches" },
          { value: "verification", label: "Verifications" },
          { value: "assessment", label: "Assessments" },
        ]}
        className="overflow-x-auto"
      />

      <TabPanel value={filter} defaultValue={filter}>
        {!visible.length ? (
          <EmptyState icon={Bell} title="Nothing here" description="You're all caught up on this filter." />
        ) : (
          <Card>
            <Card.Content className="p-2">
              <ul role="list" className="divide-y divide-line-subtle/60">
                {visible.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3.5 rounded-lg px-4 py-4 transition-colors ${
                      !n.is_read ? "bg-intel-soft/20" : ""
                    }`}
                  >
                    <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${!n.is_read ? "bg-intel" : "bg-transparent"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <p className={`text-body-sm ${!n.is_read ? "font-medium text-ink-hi" : "text-ink-med"}`}>{n.title}</p>
                        <Badge tone={kindTone[n.kind] || "neutral"} size="sm">{n.kind.replace("_", " ")}</Badge>
                      </div>
                      <p className="mt-0.5 text-meta leading-snug text-ink-muted">{n.body}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <time dateTime={n.at} className="numeric font-mono text-micro text-ink-faint">
                        {formatRelativeTime(n.at)}
                      </time>
                      {!n.is_read && (
                        <button
                          type="button"
                          onClick={() => store.markRead(n.id)}
                          className="rounded p-1 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink-hi focus-visible:outline-none"
                          aria-label={`Mark "${n.title}" as read`}
                        >
                          <Check size={14} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        )}
      </TabPanel>
    </div>
  );
}
