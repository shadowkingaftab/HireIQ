import { useNotificationStore } from "../../store/notificationStore";
import { Drawer } from "../ui";
import EmptyState from "../ui/EmptyState";
import Badge from "../ui/Badge";
import Stack from "../ui/Stack";

/**
 * Notifications shell. Reads the existing notificationStore — no second
 * notification architecture, no fabricated data: until the backend feed is
 * wired it presents a designed empty state.
 */
export default function NotificationsPanel({ open, onClose }) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);

  return (
    <Drawer open={open} onClose={onClose} title="Notifications" width="sm">
      <Stack gap="md">
        <p className="text-body-sm text-ink-muted">
          Activity across your workspace — matches, assessments and evidence updates.
        </p>
        {notifications.length === 0 ? (
          <EmptyState
            title="You're all caught up"
            description="New activity will appear here as your pipeline moves."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-line-subtle">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className={`text-body-sm ${n.is_read ? "text-ink-muted" : "font-medium text-ink-hi"}`}>
                    {n.title || n.message}
                  </p>
                  {n.created_at && (
                    <p className="mt-0.5 text-micro text-ink-faint">{n.created_at}</p>
                  )}
                </div>
                {!n.is_read && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="shrink-0 rounded p-1 text-ink-faint transition-colors hover:text-ink-hi focus-visible:outline-none"
                    aria-label="Mark as read"
                  >
                    <Badge tone="info">mark read</Badge>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </Drawer>
  );
}
