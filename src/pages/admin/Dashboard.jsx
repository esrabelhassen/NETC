import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import { Users, ShoppingCart, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import moment from 'moment';

function StatCard({ icon: Icon, title, value, color, loading }) {
  return (
    <div className="glass rounded-2xl p-6 border border-border/30">
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : (
        <>
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="text-3xl font-inter font-bold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground mt-1">{title}</div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ leads: 0, orders: 0, services: 0, revenue: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Lead.list('-created_date'),
      base44.entities.Order.list('-created_date'),
      base44.entities.Service.filter({ status: 'active' }),
    ]).then(([leads, orders, services]) => {
      const revenue = orders
        .filter(o => o.status === 'paid')
        .reduce((sum, o) => sum + (o.amount || 0), 0);

      setStats({
        leads: leads.length,
        orders: orders.length,
        services: services.length,
        revenue,
      });
      setRecentLeads(leads.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: Users, title: t('admin.totalLeads'), value: stats.leads, color: 'bg-blue-500' },
    { icon: ShoppingCart, title: t('admin.totalOrders'), value: stats.orders, color: 'bg-amber-500' },
    { icon: Briefcase, title: t('admin.activeServices'), value: stats.services, color: 'bg-emerald-500' },
    { icon: DollarSign, title: t('admin.revenue'), value: `$${stats.revenue.toLocaleString()}`, color: 'bg-accent' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-inter font-bold text-foreground">{t('admin.dashboard')}</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your platform metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} loading={loading} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="glass rounded-2xl border border-border/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              {t('admin.recentLeads')}
            </h3>
          </div>
          <div className="divide-y divide-border/30">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="px-6 py-3 flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : recentLeads.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">{t('admin.noData')}</p>
            ) : (
              recentLeads.map(lead => (
                <div key={lead.id} className="px-6 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-medium text-accent">
                    {lead.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {moment(lead.created_date).fromNow()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass rounded-2xl border border-border/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-accent" />
              {t('admin.recentOrders')}
            </h3>
          </div>
          <div className="divide-y divide-border/30">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="px-6 py-3 flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">{t('admin.noData')}</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="px-6 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-xs font-medium text-amber-500">
                    #
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{order.service_title || 'Order'}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    order.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}