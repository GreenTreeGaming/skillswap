'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  Star, 
  Shield, 
  User as UserIcon,
  Search,
  Crown,
  TrendingUp,
  Activity
} from 'lucide-react';

type UserData = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: 'skillswapper' | 'admin';
  canTeach: string[];
  wantsHelpWith: string[];
  canTeachLabels: string[];
  wantsHelpWithLabels: string[];
  onboardingCompleted: boolean;
  createdAt: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color = 'blue' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  color?: 'blue' | 'green' | 'pink' | 'purple';
}) {
  const colorClasses = {
    blue: 'from-blue-200/60 to-blue-100/40',
    green: 'from-emerald-200/60 to-emerald-100/40',
    pink: 'from-pink-200/60 to-pink-100/40',
    purple: 'from-purple-200/60 to-purple-100/40',
  };

  return (
    <div className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
      <div className={cn(
        'absolute inset-0 rounded-3xl bg-gradient-to-br opacity-40',
        colorClasses[color]
      )} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="rounded-2xl border-2 border-black/70 bg-white p-3 shadow-[0_8px_0_rgba(0,0,0,0.10)]">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black">{value}</div>
          <div className="mt-1 text-xs font-semibold text-black/70">{label}</div>
        </div>
      </div>
    </div>
  );
}

function UserCard({ user }: { user: UserData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name}
              className="h-14 w-14 rounded-2xl border-2 border-black/70 shadow-[0_8px_0_rgba(0,0,0,0.10)]"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black/70 bg-gradient-to-br from-pink-200 to-emerald-200 shadow-[0_8px_0_rgba(0,0,0,0.10)]">
              <UserIcon className="h-6 w-6 text-black/70" />
            </div>
          )}
          {user.role === 'admin' && (
            <div className="absolute -right-1 -top-1 rounded-full border-2 border-black/70 bg-yellow-400 p-1 shadow-[0_4px_0_rgba(0,0,0,0.10)]">
              <Crown className="h-3 w-3 text-black" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-base font-black">{user.name}</div>
            {user.role === 'admin' && (
              <span className="rounded-full border-2 border-black/60 bg-yellow-100 px-2 py-0.5 text-[10px] font-extrabold text-black">
                ADMIN
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs font-semibold text-black/60">{user.email}</div>

          {/* Skills Teaching */}
          <div className="mt-3">
            <div className="text-xs font-black text-black/70">Can teach:</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {user.canTeachLabels.length > 0 ? (
                user.canTeachLabels.slice(0, 4).map((skill, i) => (
                  <span 
                    key={i}
                    className="rounded-full border-2 border-black/60 bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-black"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-black/40 italic">None</span>
              )}
              {user.canTeachLabels.length > 4 && (
                <span className="text-[10px] font-semibold text-black/50">
                  +{user.canTeachLabels.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Skills Learning */}
          <div className="mt-2">
            <div className="text-xs font-black text-black/70">Wants help with:</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {user.wantsHelpWithLabels.length > 0 ? (
                user.wantsHelpWithLabels.slice(0, 4).map((skill, i) => (
                  <span 
                    key={i}
                    className="rounded-full border-2 border-black/60 bg-pink-100 px-2 py-0.5 text-[10px] font-extrabold text-black"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-black/40 italic">None</span>
              )}
              {user.wantsHelpWithLabels.length > 4 && (
                <span className="text-[10px] font-semibold text-black/50">
                  +{user.wantsHelpWithLabels.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="mt-3 flex items-center gap-2">
            <div className={cn(
              "rounded-full border-2 px-2 py-0.5 text-[10px] font-extrabold",
              user.onboardingCompleted 
                ? "border-emerald-600/60 bg-emerald-100 text-emerald-900"
                : "border-orange-600/60 bg-orange-100 text-orange-900"
            )}>
              {user.onboardingCompleted ? '✓ Active' : 'Pending setup'}
            </div>
            <div className="text-[10px] font-semibold text-black/50">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/admin/users')
        .then(async (res) => {
          if (res.status === 403) {
            setError('Access denied. Admin privileges required.');
            setLoading(false);
            return;
          }
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then((data) => {
          if (data?.users) {
            setUsers(data.users);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load admin panel');
          setLoading(false);
        });
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-spin text-black/60" />
          <div className="mt-3 text-sm font-semibold text-black/70">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-3xl border-2 border-black/70 bg-white p-8 text-center shadow-[0_18px_0_rgba(0,0,0,0.10)]">
          <Shield className="mx-auto h-12 w-12 text-red-600" />
          <div className="mt-4 text-lg font-black">{error}</div>
          <div className="mt-2 text-sm font-semibold text-black/60">
            Please contact an administrator for access.
          </div>
          <button
            onClick={() => router.push('/explore')}
            className="mt-6 cursor-pointer rounded-2xl border-2 border-black bg-black px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.12)]"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.canTeachLabels.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.wantsHelpWithLabels.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const activeUsers = users.filter(u => u.onboardingCompleted).length;
  const totalSkillsOffered = users.reduce((sum, u) => sum + u.canTeach.length, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border-2 border-black/70 bg-gradient-to-br from-purple-200 to-pink-200 p-3 shadow-[0_10px_0_rgba(0,0,0,0.10)]">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Admin Panel</h1>
              <p className="text-sm font-semibold text-black/60">
                Monitor activity and manage users
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={<Users className="h-5 w-5" />}
            label="Total Users"
            value={totalUsers}
            color="blue"
          />
          <StatCard 
            icon={<Crown className="h-5 w-5" />}
            label="Admins"
            value={adminUsers}
            color="purple"
          />
          <StatCard 
            icon={<TrendingUp className="h-5 w-5" />}
            label="Active Users"
            value={activeUsers}
            color="green"
          />
          <StatCard 
            icon={<Star className="h-5 w-5" />}
            label="Skills Offered"
            value={totalSkillsOffered}
            color="pink"
          />
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or skills..."
            className="w-full rounded-2xl border-2 border-black/70 bg-white pl-12 pr-4 py-3 text-sm font-semibold shadow-[0_10px_0_rgba(0,0,0,0.08)] outline-none focus:shadow-[0_10px_0_rgba(0,0,0,0.12)]"
          />
        </div>

        {/* Users List */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-black">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {filteredUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="rounded-3xl border-2 border-black/70 bg-white p-12 text-center shadow-[0_18px_0_rgba(0,0,0,0.10)]">
              <Users className="mx-auto h-12 w-12 text-black/40" />
              <div className="mt-4 text-lg font-black text-black/60">No users found</div>
              <div className="mt-2 text-sm font-semibold text-black/40">
                Try a different search query
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
