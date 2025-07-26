import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Clock, 
  Users, 
  Download, 
  Target,
  TrendingUp,
  Calendar,
  Award,
  Filter,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import CertificateDownloadButton from '../components/CertificateDownloadButton';

const Dashboard: React.FC = () => {
  const { user, acceptChallenge } = useAuth();
  const { leaderboard, challenges, submissions } = useData();
  // Filter submissions for current user
  const mySubmissions = user ? submissions.filter(s => s.userId === user.id) : [];
  // Tab state for switching between all and my challenges
  // (removed unused tab, filterDifficulty, filterStatus, myChallengeIds)
  // (filteredAllChallenges and filteredMyChallenges removed, not used in this file)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // ...dashboard content without challenges...

  // Find user in leaderboard for rank and completed challenges
  const leaderboardEntry = leaderboard.find(entry => entry.email === user.email);
  const userRank = leaderboardEntry ? leaderboardEntry.rank : 'Unranked';
  // Count completed challenges by user: acceptedChallenges with completed: true
  const completedChallengeIds = user.acceptedChallenges?.filter(ac => ac.completed).map(ac => ac.challengeId) || [];
  // Calculate total points from completed challenges
  const totalPoints = completedChallengeIds.length > 0
    ? challenges.filter(c => completedChallengeIds.includes(c.id)).reduce((sum, c) => sum + (c.points || 0), 0)
    : 0;


  // Badges state and effect to ensure hooks order is correct
  const [badges, setBadges] = React.useState<string[]>(Array.isArray(user.badges) ? [...user.badges] : []);

  React.useEffect(() => {
    let newBadges = Array.isArray(user.badges) ? [...user.badges] : [];
    let changed = false;
    if (totalPoints === 0 && !newBadges.includes('Welcome')) {
      newBadges.push('Welcome');
      changed = true;
    }
    if (totalPoints >= 450 && !newBadges.includes('Bronze')) {
      newBadges.push('Bronze');
      changed = true;
    }
    if (totalPoints >= 1000 && !newBadges.includes('Silver')) {
      newBadges.push('Silver');
      changed = true;
    }
    if (totalPoints >= 2000 && !newBadges.includes('Gold')) {
      newBadges.push('Gold');
      changed = true;
    }
    if ((user.acceptedChallenges?.filter(ac => ac.completed).length || 0) >= 10 && !newBadges.includes('Marathoner')) {
      newBadges.push('Marathoner');
      changed = true;
    }
    if (user.joinedAt && (Date.now() - new Date(user.joinedAt).getTime() < 21 * 24 * 60 * 60 * 1000) && !newBadges.includes('Consistent')) {
      newBadges.push('Consistent');
      changed = true;
    }
    if (user.joinedAt && new Date(user.joinedAt).getTime() < new Date('2025-07-08').getTime() && !newBadges.includes('Early Bird')) {
      newBadges.push('Early Bird');
      changed = true;
    }
    if (changed) {
      setBadges(newBadges);
      updateDoc(doc(db, 'users', user.email), { badges: newBadges });
      localStorage.setItem('datasprint_user', JSON.stringify({ ...user, badges: newBadges }));
    }
    // Only update if changed
    // eslint-disable-next-line
  }, [user, totalPoints]);

  const badgeCount = badges.length;

  const stats = [
    {
      label: 'Total Points',
      value: totalPoints.toLocaleString(),
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Challenges Completed',
      value: completedChallengeIds.length.toString(),
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Current Rank',
      value: userRank === 'Unranked' ? 'Unranked' : `#${userRank}`,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Badges Earned',
      value: badgeCount.toString(),
      icon: Award,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Removed unused getDifficultyColor and getStatusColor

  return (
  <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 dark:bg-slate-900">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Welcome back, {user.name}! 🚀
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Ready to tackle some data challenges today?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-md border border-slate-200 dark:border-slate-700 mb-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Your Badges
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {badges.map((badge, index) => (
            <span
              key={index}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs sm:text-sm font-medium shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Challenges Accepted Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-md border border-slate-200 dark:border-slate-700 mb-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Challenges Accepted
        </h2>

        {!user.acceptedChallenges || user.acceptedChallenges.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">You haven’t accepted any challenges yet.</p>
        ) : (
          <div className="overflow-x-auto max-h-80" style={{ maxHeight: '22rem' }}>
            <table className="w-full text-sm sm:text-base">
              
            <thead>
  <tr className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
    <th className="px-4 py-2 text-left whitespace-nowrap">Challenge</th>
    <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
    <th className="px-4 py-2 text-left whitespace-nowrap">Certificate</th>
    <th className="px-4 py-2 text-left whitespace-nowrap">View</th>
  </tr>
</thead>
<tbody>
  {(user.acceptedChallenges).map((ac, idx) => {
    const challenge = challenges.find(c => c.id === ac.challengeId);
    return (
      <tr
        key={ac.challengeId + idx}
        className="border-b border-slate-100 dark:border-slate-700 even:bg-slate-50 dark:even:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        <td className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">
          {challenge?.title || ac.challengeId}
        </td>
        <td className="px-4 py-3">
          {ac.completed ? (
            <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold">
              Completed
            </span>
          ) : (
            <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-semibold">
              Pending
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          {ac.completed ? (
            <CertificateDownloadButton
              elementId="certificate"
              filename={`Certificate-${user.name}-${challenge?.title || ac.challengeId}.pdf`}
              studentName={user.name}
              challengeName={challenge?.title || ac.challengeId}
            />
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </td>
        <td className="px-4 py-3">
          <Link
            to={`/challenge/${challenge?.id}`}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition"
          >
            <ChevronRight className="w-4 h-4" />
            View
          </Link>
        </td>
      </tr>
    );
  })}
</tbody>

            </table>
          </div>
        )}

        {/* View All button removed. All accepted challenges are shown. */}
      </motion.div>
    </div>
  </div>
);

};

export default Dashboard;