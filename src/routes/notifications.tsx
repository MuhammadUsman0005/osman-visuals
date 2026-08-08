import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  PackageCheck, 
  Info, 
  CheckCheck, 
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | Osman Visuals" },
      { name: "description", content: "New releases, resources, and important updates from your archive." },
    ],
  }),
  component: NotificationsPage,
});

export interface NotificationItem {
  id: string;
  type: "New Release" | "New Prompt" | "Resource Update" | "Account" | "Security" | "System";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      if (data) {
        const formatted: NotificationItem[] = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          message: item.message,
          createdAt: item.created_at || item.createdAt,
          read: item.is_read ?? item.read ?? false,
          actionLabel: item.action_label || item.actionLabel,
          actionUrl: item.action_url || item.actionUrl,
        }));
        setNotifications(formatted);
      }
    };

    fetchNotifications();
    
    // Realtime subscription
    const channel = (supabase as any)
      .channel('schema-db-changes')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        (payload: { new: any }) => {
          const newItem: NotificationItem = {
            id: payload.new.id,
            type: payload.new.type,
            title: payload.new.title,
            message: payload.new.message,
            createdAt: payload.new.created_at || payload.new.createdAt,
            read: payload.new.is_read ?? payload.new.read ?? false,
            actionLabel: payload.new.action_label || payload.new.actionLabel,
            actionUrl: payload.new.action_url || payload.new.actionUrl,
          };
          setNotifications((prev) => [newItem, ...prev]);
        }
      )
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, []);

  const updateStorage = (updatedList: NotificationItem[]) => {
    setNotifications(updatedList);
    localStorage.setItem("osman_notifications", JSON.stringify(updatedList));
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.read) {
      const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
      updateStorage(updated);
      
      await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('id', item.id);
    }
    if (item.actionUrl) {
      navigate({ to: item.actionUrl as any });
    }
  };

  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    updateStorage(updated);

    await (supabase as any)
      .from('notifications')
      .update({ is_read: true })
      .neq('is_read', true);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return !n.read;
    return true;
  });

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "New Release": return <Sparkles className="w-4 h-4 text-gold" />;
      case "New Prompt": return <PackageCheck className="w-4 h-4 text-gold" />;
      case "Resource Update": return <Info className="w-4 h-4 text-bone/70" />;
      case "Security": return <ShieldCheck className="w-4 h-4 text-gold" />;
      case "Account": return <UserCheck className="w-4 h-4 text-bone/70" />;
      case "System": default: return <Bell className="w-4 h-4 text-bone/60" />;
    }
  };

  const getDateGroup = (dateString: string) => {
    if (!dateString) return "EARLIER";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "TODAY";
    if (isYesterday) return "YESTERDAY";
    return "EARLIER";
  };

  const groupedNotifications = {
    TODAY: filteredNotifications.filter(n => getDateGroup(n.createdAt) === "TODAY"),
    YESTERDAY: filteredNotifications.filter(n => getDateGroup(n.createdAt) === "YESTERDAY"),
    EARLIER: filteredNotifications.filter(n => getDateGroup(n.createdAt) === "EARLIER"),
  };

  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 pt-20 pb-10">
          <p className="eyebrow">CAT. VII — NOTIFICATIONS</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-bone leading-tight">
                What’s new in your archive.
              </h1>
              <p className="mt-3 text-bone/70 max-w-xl text-sm md:text-base leading-relaxed">
                New releases, resources, and important updates — kept in one place.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-bone border border-gold/30 hover:border-gold px-4 py-2 rounded-full transition-all bg-gold/5 hover:bg-gold/10 self-start md:self-auto cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 lg:px-10 py-10 min-h-[50vh]">
        <div className="flex items-center gap-6 border-b hairline pb-4 mb-8">
          <button
            onClick={() => setFilter("ALL")}
            className={`text-xs uppercase tracking-widest pb-1 transition-colors relative cursor-pointer ${
              filter === "ALL" 
                ? "text-bone font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-gold" 
                : "text-bone/50 hover:text-bone"
            }`}
          >
            All <span className="ml-1 text-[10px] opacity-60">({notifications.length})</span>
          </button>
          
          <button
            onClick={() => setFilter("UNREAD")}
            className={`text-xs uppercase tracking-widest pb-1 transition-colors relative flex items-center gap-2 cursor-pointer ${
              filter === "UNREAD" 
                ? "text-bone font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-gold" 
                : "text-bone/50 hover:text-bone"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center bg-gold text-void text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">
              All caught up.
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-bone mb-3">
              There’s nothing new here.
            </h2>
            <p className="text-sm md:text-base text-bone/60 max-w-md mx-auto mb-8 leading-relaxed">
              We’ll keep this space updated when something worth seeing arrives.
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 bg-gold text-void px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-all rounded-full hover:scale-105 shadow-lg shadow-gold/10"
            >
              Explore the Archive →
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {(["TODAY", "YESTERDAY", "EARLIER"] as const).map((groupKey) => {
              const groupItems = groupedNotifications[groupKey];
              if (groupItems.length === 0) return null;

              return (
                <div key={groupKey} className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-bone/40 font-semibold mb-4">
                    {groupKey}
                  </div>

                  <div className="space-y-3">
                    {groupItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`group relative p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          item.read 
                            ? "bg-surface/30 border-bone/10 opacity-75 hover:opacity-100 hover:border-bone/20" 
                            : "bg-surface/80 border-gold/40 shadow-md shadow-gold/5 hover:border-gold"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-lg border shrink-0 mt-0.5 transition-colors ${
                            item.read ? "bg-void/40 border-bone/10" : "bg-gold/10 border-gold/30"
                          }`}>
                            {getNotificationIcon(item.type)}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] uppercase tracking-widest text-gold font-medium">
                                {item.type}
                              </span>
                              <span className="text-bone/20">•</span>
                              <span className="text-[11px] text-bone/50">
                                {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>

                            <h3 className={`font-display text-lg transition-colors ${item.read ? "text-bone/90" : "text-bone font-medium"}`}>
                              {item.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-bone/70 leading-relaxed max-w-2xl">
                              {item.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-bone/10">
                          {item.actionLabel && (
                            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold group-hover:underline">
                              <span>{item.actionLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                          )}

                          {!item.read && (
                            <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 animate-pulse" title="Unread" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}