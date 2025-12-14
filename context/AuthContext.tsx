import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  users: User[];
  addUser: (user: User, referralCode?: string) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  earnTokens: (userId: string, amount: number) => void;
  claimDailyBonus: (userId: string) => { success: boolean; message: string };
  completeLesson: (userId: string, courseId: string, totalLessons: number) => { success: boolean, newAchievement?: boolean };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    const parsedUsers = saved ? JSON.parse(saved) : [
      { 
          id: '1', 
          name: 'Admin User', 
          email: 'admin@crypto.kz', 
          password: '123', 
          role: UserRole.ADMIN, 
          balance: 9999, 
          referralCode: 'ADMIN01', 
          referralReward: 50, 
          achievements: ['early_adopter'], 
          courseProgress: {},
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
      },
      { 
          id: '2', 
          name: 'Test Client', 
          email: 'client@test.com', 
          password: '123', 
          role: UserRole.USER, 
          balance: 15, 
          referralCode: 'CLIENT77', 
          referralReward: 10, 
          achievements: [], 
          courseProgress: {},
          avatar: ''
      }
    ];
    return parsedUsers.map((u: any) => ({
        ...u,
        balance: u.balance || 0,
        referralCode: u.referralCode || Math.random().toString(36).substring(7).toUpperCase(),
        referralReward: u.referralReward || 10,
        achievements: u.achievements || [],
        lastDailyBonus: u.lastDailyBonus || null,
        courseProgress: u.courseProgress || {},
        avatar: u.avatar || ''
    }));
  });

  useEffect(() => { 
    try {
        localStorage.setItem('users', JSON.stringify(users)); 
    } catch (e) {
        console.error("Storage limit exceeded:", e);
        // Alerting only once or handling gently would be better in a real app, 
        // but for now, we ensure the app doesn't crash.
        alert("Внимание: Память браузера переполнена. Изображение может не сохраниться. Попробуйте загрузить файл меньшего размера.");
    }
  }, [users]);

  const addUser = (user: User, referralCode?: string) => {
    let currentUsersList = [...users];
    let finalUser = { ...user, id: user.id || Date.now().toString() };
    
    if (users.length < 1000 && !finalUser.achievements.includes('early_adopter')) {
        finalUser.achievements = [...finalUser.achievements, 'early_adopter'];
        finalUser.balance += 1000;
    }

    if (referralCode) {
        const referrerIndex = currentUsersList.findIndex(u => u.referralCode === referralCode && u.email !== user.email);
        if (referrerIndex !== -1) {
            const referrer = currentUsersList[referrerIndex];
            currentUsersList[referrerIndex] = { ...referrer, balance: referrer.balance + 25 };
            const bonusAmount = referrer.referralReward || 10;
            finalUser.balance = finalUser.balance + bonusAmount;
        }
    }
    setUsers([...currentUsersList, finalUser]);
  };
  
  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const earnTokens = (userId: string, amount: number) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));
  };

  // POINT 2: Enhanced Mining Protection
  const claimDailyBonus = (userId: string) => {
    let result = { success: false, message: '' };
    
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === userId) {
            const now = new Date();
            const lastClaim = u.lastDailyBonus ? new Date(u.lastDailyBonus) : null;
            
            // Security: Check if user modified system time to be in the past relative to last claim
            if (lastClaim && lastClaim.getTime() > now.getTime()) {
                result = { success: false, message: 'Ошибка синхронизации времени' };
                return u;
            }

            if (!lastClaim || (now.getTime() - lastClaim.getTime() >= 24 * 60 * 60 * 1000)) {
                result = { success: true, message: 'Бонус получен!' };
                return { 
                    ...u, 
                    balance: u.balance + 5, 
                    lastDailyBonus: now.toISOString() 
                };
            } else {
                result = { success: false, message: 'Бонус еще не доступен' };
                return u;
            }
        }
        return u;
    }));
    return result;
  };

  const completeLesson = (userId: string, courseId: string, totalLessons: number) => {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return { success: false, newAchievement: false };

      const user = users[userIndex];
      const currentProgress = Number(user.courseProgress?.[courseId] || 0);

      if (currentProgress >= totalLessons) return { success: false, newAchievement: false };

      const nextProgress = currentProgress + 1;
      let newAchievement = false;
      let updatedAchievements = [...user.achievements];
      let currentBalance = user.balance;

      if (nextProgress >= totalLessons) {
          if (!updatedAchievements.includes('knowledge_seeker')) {
              updatedAchievements.push('knowledge_seeker');
              newAchievement = true;
              if (courseId === '1') currentBalance += 1000;
          }
      }

      const updatedUser = {
          ...user,
          balance: currentBalance,
          courseProgress: { ...user.courseProgress, [courseId]: nextProgress },
          achievements: updatedAchievements
      };

      const newUsers = [...users];
      newUsers[userIndex] = updatedUser;
      setUsers(newUsers);

      return { success: true, newAchievement };
  };

  return (
    <AuthContext.Provider value={{
      users, addUser, updateUser, deleteUser,
      earnTokens, claimDailyBonus, completeLesson
    }}>
      {children}
    </AuthContext.Provider>
  );
};