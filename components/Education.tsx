import React, { useState } from 'react';
import { BookOpen, Trophy, Play, Lock, CheckCircle, X, Award, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { User } from '../types';

interface EducationProps {
    currentUser: User | null;
}

const Education: React.FC<EducationProps> = ({ currentUser: propUser }) => {
  const { users, completeLesson } = useAuth();
  const { courses } = useMarket();
  
  const currentUser = propUser ? (users.find(u => u.id === propUser.id) || propUser) : null;
  
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const COURSE_1_LESSONS = [
      { id: 1, title: "Что такое Блокчейн?", duration: "5:00" },
      { id: 2, title: "Как создать кошелек?", duration: "8:30" },
      { id: 3, title: "Первая покупка криптовалюты", duration: "6:15" },
      { id: 4, title: "Безопасность и хранение", duration: "10:00" },
      { id: 5, title: "Основы трейдинга", duration: "12:45" },
  ];

  const handleStartCourse = (courseId: string) => {
      if (courseId === '1') {
          setActiveCourseId(courseId);
          setSelectedLesson(null);
      } else {
          alert("Этот курс пока находится в разработке.");
      }
  };

  const handleFinishLesson = (lessonIndex: number) => {
      if (!currentUser) {
          alert("Пожалуйста, войдите в систему, чтобы сохранить прогресс.");
          return;
      }
      
      const res = completeLesson(currentUser.id, '1', 5);
      
      if (res.newAchievement) {
          setShowRewardModal(true);
      }
      setSelectedLesson(null);
  };

  const getProgress = () => {
      if (!currentUser || !currentUser.courseProgress) return 0;
      return Number(currentUser.courseProgress['1'] || 0);
  };

  const currentProgress = getProgress();
  const isCourseCompleted = currentProgress >= 5;

  const activeLessonIndex = selectedLesson !== null 
      ? selectedLesson 
      : (isCourseCompleted ? null : currentProgress);

  return (
    <div className="bg-white py-12 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-bold text-center text-primary mb-16">Обучающие курсы</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col bg-white group">
                    <div className="h-48 overflow-hidden relative">
                         <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                            {course.level}
                        </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h3>
                        <div className="text-gray-500 text-sm mb-6 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {course.lessons} занятий
                        </div>
                        
                        <div className="mt-auto">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-gray-900">
                                    {course.price === 0 ? 'Бесплатно' : `${course.price.toLocaleString()} ₸`}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleStartCourse(course.id)}
                                className={`w-full font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${
                                    course.id === '1' && isCourseCompleted 
                                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                                    : 'bg-blue-50 hover:bg-blue-600 text-white hover:shadow-blue-200'
                                }`}
                            >
                                {course.id === '1' && isCourseCompleted ? (
                                    <><RotateCcw size={18} /> Повторить курс</>
                                ) : (
                                    course.id === '1' && currentProgress > 0 ? 'Продолжить обучение' : 'Пройти курс'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Gamification teaser */}
        <div className="mt-20 bg-gradient-to-r from-secondary to-yellow-500 rounded-2xl p-8 md:p-12 text-center text-primary relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-white" />
                <h2 className="text-3xl font-bold mb-4">Учись и получай награды!</h2>
                <p className="text-lg font-medium opacity-90 mb-8 max-w-2xl mx-auto">
                    Проходите курсы, сдавайте тесты и получайте NFT-сертификаты и баллы лояльности.
                </p>
                <button className="bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-md">
                    Узнать подробнее
                </button>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

      </div>

      {/* COURSE PLAYER MODAL */}
      {activeCourseId === '1' && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
              <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                  {/* Header */}
                  <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="text-xl font-bold text-primary">Крипта для новичков</h2>
                          <p className="text-sm text-gray-500">Прогресс: {currentProgress} / 5</p>
                      </div>
                      <button onClick={() => setActiveCourseId(null)} className="p-2 hover:bg-gray-200 rounded-full transition">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                      {/* Active Video Player Placeholder */}
                      <div className="aspect-video bg-black rounded-xl mb-8 flex items-center justify-center relative overflow-hidden group shadow-lg">
                          {activeLessonIndex !== null ? (
                              <div className="text-center p-4">
                                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-white/50 cursor-pointer hover:bg-white/30 transition">
                                      <Play size={32} className="text-white ml-1" />
                                  </div>
                                  <p className="text-white text-lg font-medium">
                                      Урок {activeLessonIndex + 1}: {COURSE_1_LESSONS[activeLessonIndex]?.title}
                                  </p>
                                  {activeLessonIndex < currentProgress && (
                                      <p className="text-green-400 text-sm mt-2 font-bold flex items-center justify-center gap-1">
                                          <CheckCircle size={14} /> Вы уже просмотрели этот урок
                                      </p>
                                  )}
                              </div>
                          ) : (
                              // Course Completed View (shown only if finished and no lesson selected)
                              <div className="text-center text-green-400 animate-in zoom-in duration-300">
                                  <CheckCircle size={80} className="mx-auto mb-6 drop-shadow-lg" />
                                  <h3 className="text-3xl font-bold text-white mb-2">Курс пройден!</h3>
                                  <p className="text-gray-300 mb-6">Вы можете пересмотреть любой урок, выбрав его в списке ниже.</p>
                                  <button 
                                     onClick={() => setSelectedLesson(0)}
                                     className="bg-white text-primary px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition flex items-center mx-auto gap-2"
                                  >
                                      <RotateCcw size={16} /> Начать заново
                                  </button>
                              </div>
                          )}
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-center mb-8 h-12">
                           {activeLessonIndex !== null && (
                                activeLessonIndex === currentProgress ? (
                                    <button 
                                        onClick={() => handleFinishLesson(activeLessonIndex)}
                                        className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-800 transition shadow-lg flex items-center gap-2"
                                    >
                                        <CheckCircle size={20} />
                                        Завершить просмотр урока {activeLessonIndex + 1}
                                    </button>
                                ) : (
                                    <button 
                                        disabled
                                        className="bg-green-100 text-green-700 px-8 py-3 rounded-full font-bold border border-green-200 flex items-center gap-2 cursor-default"
                                    >
                                        <CheckCircle size={20} />
                                        Урок пройден
                                    </button>
                                )
                           )}
                      </div>

                      {/* Lessons Timeline */}
                      <div className="relative pb-4">
                          <div className="absolute top-[28px] left-0 w-full h-1 bg-gray-300 z-0 hidden md:block"></div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                              {COURSE_1_LESSONS.map((lesson, index) => {
                                  const isCompleted = index < currentProgress;
                                  const isSelected = activeLessonIndex === index; 
                                  const isLocked = index > currentProgress;

                                  return (
                                      <button 
                                          key={lesson.id} 
                                          disabled={isLocked}
                                          onClick={() => !isLocked && setSelectedLesson(index)}
                                          className={`
                                              flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all duration-300
                                              ${isCompleted 
                                                  ? 'bg-green-50 border-green-500 hover:bg-green-100 cursor-pointer' 
                                                  : isSelected 
                                                      ? 'bg-white border-secondary shadow-lg scale-105 cursor-default'
                                                      : isLocked 
                                                          ? 'bg-gray-50 border-gray-200 opacity-60 grayscale cursor-not-allowed'
                                                          : 'bg-white border-gray-300 hover:border-secondary cursor-pointer'
                                              }
                                          `}
                                      >
                                          <div className={`
                                              w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white font-bold transition-colors
                                              ${isCompleted ? 'bg-green-500' : 
                                                isSelected ? 'bg-secondary' : 
                                                'bg-gray-300'}
                                          `}>
                                              {isCompleted && !isSelected ? <CheckCircle size={20} /> : 
                                               isLocked ? <Lock size={16} /> : 
                                               index + 1}
                                          </div>
                                          <div className="text-xs font-bold text-gray-800 mb-1 line-clamp-1">{lesson.title}</div>
                                          <div className="text-[10px] text-gray-500">{lesson.duration}</div>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* REWARD MODAL */}
      {showRewardModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                  
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Award size={48} className="text-orange-500" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Поздравляем!</h3>
                  <p className="text-gray-600 mb-6">
                      Вы успешно завершили курс "Крипта для новичков" и получили достижение <span className="font-bold text-primary">"Ученик"</span> и <span className="font-bold text-secondary">1000 CMK</span>!
                  </p>
                  
                  <button 
                      onClick={() => { setShowRewardModal(false); setActiveCourseId(null); }}
                      className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-emerald-800 transition"
                  >
                      Отлично!
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default Education;