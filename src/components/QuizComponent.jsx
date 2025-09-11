import React, { useState, useEffect } from 'react';

const QuizComponent = ({ quizFile }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchUrl = `/data/quizzes/${quizFile}`;
        console.log('QuizComponent: Starting to load quiz');
        console.log('QuizComponent: Fetch URL:', fetchUrl);
        console.log('QuizComponent: Current location:', window.location.href);
        
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
          const response = await fetch(fetchUrl, { 
            signal: controller.signal,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          clearTimeout(timeoutId);
        console.log('QuizComponent: Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const responseText = await response.text();
        console.log('QuizComponent: Raw response length:', responseText.length);
        console.log('QuizComponent: First 200 chars:', responseText.substring(0, 200));
        
        const quizData = JSON.parse(responseText);
        console.log('QuizComponent: Parsed quiz data:', {
          title: quizData.title,
          questionCount: quizData.questions?.length,
          hasQuestions: Array.isArray(quizData.questions)
        });
        
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
          throw new Error('Quiz verisi geçersiz: sorular bulunamadı');
        }
        
        setQuiz(quizData);
        console.log('QuizComponent: Quiz loaded successfully!');
        
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          throw fetchErr;
        }
      } catch (err) {
        console.error('QuizComponent: Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        
        let errorMessage = 'Quiz yüklenirken hata oluştu';
        if (err.name === 'AbortError') {
          errorMessage = 'Quiz yükleme zaman aşımına uğradı (10 saniye)';
        } else if (err.message) {
          errorMessage += ': ' + err.message;
        }
        
        setError(errorMessage);
        setDebugInfo(`Debug: ${err.name} - ${err.message}`);
      } finally {
        console.log('QuizComponent: Setting loading to false');
        setLoading(false);
      }
    };

  console.log('QuizComponent: useEffect triggered with quizFile:', quizFile);
    console.log('QuizComponent: Current window location:', window?.location?.href);
    if (quizFile) {
      loadQuiz();
    } else {
      console.log('QuizComponent: No quizFile provided');
      setLoading(false);
    }
  }, [quizFile]);

  // Auto-advance to next question after feedback (only if answer was selected)
  useEffect(() => {
    if (showFeedback && currentAnswer !== null) {
      const timer = setTimeout(() => {
        nextQuestionWithDelay();
      }, 2500); // 2.5 seconds to read feedback
      
      return () => clearTimeout(timer);
    }
  }, [showFeedback, currentQuestion, currentAnswer]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setCurrentAnswer(answerIndex);
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    setShowFeedback(true);
    
    // Add to answered questions if not already there
    if (!answeredQuestions.includes(questionId)) {
      setAnsweredQuestions(prev => [...prev, questionId]);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const nextQuestionWithDelay = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
      setCurrentAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    
    let correct = 0;
    quiz.questions.forEach(question => {
      const answer = selectedAnswers[question.id];
      if (answer !== undefined && answer !== null && answer === question.correctAnswer) {
        correct++;
      }
    });
    
    // Calculate score based on total questions (correct answers / total questions)
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const getAnsweredCount = () => {
    if (!quiz) return 0;
    let answered = 0;
    quiz.questions.forEach(question => {
      const answer = selectedAnswers[question.id];
      if (answer !== undefined && answer !== null) {
        answered++;
      }
    });
    return answered;
  };

  const getSkippedCount = () => {
    if (!quiz) return 0;
    let skipped = 0;
    quiz.questions.forEach(question => {
      const answer = selectedAnswers[question.id];
      if (answer === null || answer === undefined) {
        skipped++;
      }
    });
    return skipped;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowFeedback(false);
    setCurrentAnswer(null);
    setAnsweredQuestions([]);
    setQuizStarted(false);
  };

  const skipToNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
      setCurrentAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
  };

  const skipQuestion = () => {
    // Mark question as "skipped" with null value
    const currentQ = quiz.questions[currentQuestion];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: null // null indicates skipped
    }));
    
    // Move to next question
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
      setCurrentAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 my-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-gray-300">Quiz yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container bg-slate-800/50 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8 my-8">
        <div className="text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">Quiz Hatası</div>
          <p className="text-gray-300 mb-4">{error}</p>
          {debugInfo && (
            <details className="text-left">
              <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">Teknik Detaylar</summary>
              <pre className="text-xs text-gray-500 mt-2 p-2 bg-slate-900/50 rounded overflow-x-auto">{debugInfo}</pre>
            </details>
          )}
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const score = calculateScore();
  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  
  // Get current answer for display (check if this question has been answered)
  const currentQuestionAnswer = currentQ ? selectedAnswers[currentQ.id] : null;
  const displayCurrentAnswer = currentAnswer !== null ? currentAnswer : currentQuestionAnswer;
  const isCorrect = displayCurrentAnswer !== null && displayCurrentAnswer === currentQ.correctAnswer;

  // Quiz Welcome Screen
  if (!quizStarted) {
    return (
      <div className="quiz-container relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-blue-900/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 my-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl"></div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-400/30">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              {quiz.title}
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              {quiz.description || 'Bilginizi test edin ve öğrenme yolculuğunuza devam edin!'}
            </p>
            <div className="text-sm text-gray-500 max-w-2xl mx-auto mb-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <strong>Puanlama Sistemi</strong>
              </div>
              <p>Skorunuz, doğru cevapladığınız soru sayısının toplam soru sayısına oranı olarak hesaplanır.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400 mb-2">{quiz.questions.length}</div>
              <div className="text-sm text-gray-400">Soru</div>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400 mb-2">~{Math.ceil(quiz.questions.length * 1.5)}</div>
              <div className="text-sm text-gray-400">Dakika</div>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400 mb-2">{quiz.passingScore || 80}%</div>
              <div className="text-sm text-gray-400">Geçme Notu</div>
            </div>
          </div>
          
          <button
            onClick={startQuiz}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
          >
            <svg className="w-6 h-6 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4m6-4v4m-6-4H3m6 4H3m12-4h6m-6 4h6"/>
            </svg>
            Quiz'e Başla
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:animate-shimmer"></div>
          </button>
          
          <div className="mt-6 text-xs text-gray-500">
            ✨ Her sorudan sonra anında geri bildirim alacaksınız
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = quiz.questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const answeredCount = getAnsweredCount();
    const skippedCount = getSkippedCount();
    
    return (
      <div className="quiz-container relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-blue-900/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 my-8">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            {/* Celebration Header */}
            <div className="mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl border-2 ${
                score >= (quiz.passingScore || 80) 
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50' 
                  : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50'
              }`}>
                <div className="text-4xl">
                  {score >= (quiz.passingScore || 80) ? '🎉' : '📚'}
                </div>
              </div>
              
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Quiz Tamamlandı!
              </h3>
              
              <div className={`text-6xl font-bold mb-4 score-animation ${getScoreColor(score)}`}>
                {score}%
              </div>
              
              <p className="text-gray-400 text-lg mb-6">
                <span className="font-semibold text-white">{correctAnswers}</span> / {quiz.questions.length} soru doğru cevaplandı
                <br />
                <span className="text-sm">(<span className="font-semibold text-white">{answeredCount}</span> cevaplandı, <span className="font-semibold text-yellow-400">{skippedCount}</span> atlandı)</span>
              </p>
              
              {score >= (quiz.passingScore || 80) ? (
                <div className="text-green-400 text-xl font-bold mb-6">
                  ✨ Mükemmel! Quiz'i başarıyla geçtiniz! ✨
                </div>
              ) : score >= 70 ? (
                <div className="text-blue-400 text-xl font-bold mb-6">
                  🚀 İyi performans! Biraz daha çalışmanız yeterli!
                </div>
              ) : score >= 50 ? (
                <div className="text-yellow-400 text-xl font-bold mb-6">
                  💪 İyi deneme! Çalışmaya devam edin!
                </div>
              ) : (
                <div className="text-orange-400 text-xl font-bold mb-6">
                  📖 Daha çok çalışma gerekiyor. Vazgeçmeyin!
                </div>
              )}
            </div>
            
            {/* Performance Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="text-green-400 text-2xl font-bold">{correctAnswers}</div>
                <div className="text-sm text-gray-400">Doğru</div>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="text-red-400 text-2xl font-bold">{answeredCount - correctAnswers}</div>
                <div className="text-sm text-gray-400">Yanlış</div>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="text-yellow-400 text-2xl font-bold">{skippedCount}</div>
                <div className="text-sm text-gray-400">Atlandı</div>
              </div>
              <div className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 ${
                score >= (quiz.passingScore || 80) ? 'ring-2 ring-green-400/50' : ''
              }`}>
                <div className={`text-2xl font-bold ${
                  score >= (quiz.passingScore || 80) ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {score >= (quiz.passingScore || 80) ? '✅' : '⭐'}
                </div>
                <div className="text-sm text-gray-400">
                  {score >= (quiz.passingScore || 80) ? 'Başarılı' : 'Tekrar Dene'}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Review Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Cevaplarınızı İnceleyin
            </h4>
            
            <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isSkipped = userAnswer === null || userAnswer === undefined;
                const isCorrect = !isSkipped && userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`p-4 rounded-xl border-2 backdrop-blur-sm ${
                    isSkipped 
                      ? 'border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5'
                      : isCorrect 
                      ? 'border-green-400/30 bg-gradient-to-r from-green-500/10 to-green-400/5' 
                      : 'border-red-400/30 bg-gradient-to-r from-red-500/10 to-red-400/5'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        isSkipped
                          ? 'border-yellow-400 bg-yellow-400 text-white'
                          : isCorrect 
                          ? 'border-green-400 bg-green-400 text-white' 
                          : 'border-red-400 bg-red-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium mb-2 line-clamp-2">{question.question}</p>
                        
                        <div className="space-y-1 text-sm">
                          <p className={isSkipped ? 'text-yellow-300' : isCorrect ? 'text-green-300' : 'text-red-300'}>
                            <strong>Sizin cevabınız:</strong> {isSkipped ? 'Atlandı' : `${String.fromCharCode(65 + userAnswer)} - ${question.options[userAnswer]}`}
                          </p>
                          {(isSkipped || !isCorrect) && (
                            <p className="text-green-300">
                              <strong>Doğru cevap:</strong> {String.fromCharCode(65 + question.correctAnswer)} - {question.options[question.correctAnswer]}
                            </p>
                          )}
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-slate-800/30 border border-slate-600/30 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              <span className="text-blue-300 font-medium text-xs">Açıklama</span>
                            </div>
                            <p className="text-gray-300 text-xs leading-relaxed">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isSkipped ? 'text-yellow-400' : isCorrect ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isSkipped ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        ) : isCorrect ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              <svg className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Quiz'i Tekrar Çöz
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:animate-shimmer"></div>
            </button>
            
            <div className="mt-4 text-xs text-gray-500">
              💡 Her seferinde daha iyi olacaksınız!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-900/10 to-blue-900/20 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 my-8">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/3 to-blue-500/3 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        {/* Enhanced Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{quiz.title}</h3>
                <p className="text-gray-400 text-sm">Soru {currentQuestion + 1} / {quiz.questions.length}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{Math.round(progress)}%</div>
              <div className="text-xs text-gray-500">Tamamlandı</div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-full h-3 border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < currentQuestion
                      ? 'bg-green-400 shadow-lg shadow-green-400/50'
                      : index === currentQuestion
                      ? 'bg-purple-400 shadow-lg shadow-purple-400/50 animate-pulse'
                      : 'bg-slate-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Amazing Question Interface */}
        <div className="mb-8">
          <div className={`transform transition-all duration-500 ${
            showFeedback ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
          }`}>
            <h4 className="text-xl font-bold text-white mb-6 leading-relaxed">
              {currentQ.question}
            </h4>
            
            <div className="space-y-4">
              {currentQ.options.map((option, index) => {
                let buttonClass = 'w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden';
                let iconClass = 'w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold';
                let letterClass = 'w-8 h-8 rounded-lg border border-slate-600/50 mr-4 flex items-center justify-center text-sm font-bold bg-slate-700/30';
                
                if (showFeedback) {
                  if (index === currentQ.correctAnswer) {
                    // Correct answer - always show as correct
                    buttonClass += ' border-green-400 bg-gradient-to-r from-green-500/20 to-green-400/10 text-white shadow-lg shadow-green-500/20';
                    iconClass = 'w-6 h-6 rounded-full border-2 border-green-400 bg-green-400 mr-4 flex items-center justify-center text-white';
                    letterClass = 'w-8 h-8 rounded-lg border border-green-400 bg-green-400 mr-4 flex items-center justify-center text-sm font-bold text-white';
                  } else if (index === displayCurrentAnswer && index !== currentQ.correctAnswer) {
                    // Wrong answer that user selected
                    buttonClass += ' border-red-400 bg-gradient-to-r from-red-500/20 to-red-400/10 text-white shadow-lg shadow-red-500/20';
                    iconClass = 'w-6 h-6 rounded-full border-2 border-red-400 bg-red-400 mr-4 flex items-center justify-center text-white';
                    letterClass = 'w-8 h-8 rounded-lg border border-red-400 bg-red-400 mr-4 flex items-center justify-center text-sm font-bold text-white';
                  } else {
                    // Other options - dimmed
                    buttonClass += ' border-slate-600/50 bg-slate-800/30 text-gray-500 opacity-60';
                    iconClass = 'w-6 h-6 rounded-full border-2 border-slate-600 mr-4 flex items-center justify-center text-slate-500';
                    letterClass = 'w-8 h-8 rounded-lg border border-slate-600 bg-slate-700/50 mr-4 flex items-center justify-center text-sm font-bold text-slate-500';
                  }
                } else {
                  if (displayCurrentAnswer === index) {
                    buttonClass += ' border-purple-400 bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-white shadow-lg shadow-purple-500/20';
                    iconClass = 'w-6 h-6 rounded-full border-2 border-purple-400 bg-purple-400 mr-4 flex items-center justify-center text-white';
                  } else {
                    buttonClass += ' border-slate-600/50 hover:border-purple-400/50 bg-slate-800/40 hover:bg-slate-700/50 text-gray-300 hover:text-white hover:shadow-lg hover:shadow-purple-500/10';
                    iconClass = 'w-6 h-6 rounded-full border-2 border-slate-500 mr-4 flex items-center justify-center text-slate-400';
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswerSelect(currentQ.id, index)}
                    disabled={showFeedback}
                    className={buttonClass}
                  >
                    <div className="flex items-center relative z-10">
                      <div className={letterClass}>
                        {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{option}</span>
                      </div>
                      <div className={iconClass}>
                        {showFeedback && index === currentQ.correctAnswer && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                        {showFeedback && index === displayCurrentAnswer && index !== currentQ.correctAnswer && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        )}
                        {!showFeedback && displayCurrentAnswer === index && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    {!showFeedback && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 translate-x-[-100%] hover:animate-shimmer"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Amazing Feedback Section */}
        {showFeedback && (
          <div className={`mb-8 transform transition-all duration-500 ${
            showFeedback ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className={`p-6 rounded-2xl border-2 backdrop-blur-sm ${
              isCorrect 
                ? 'border-green-400/50 bg-gradient-to-br from-green-500/20 via-green-400/10 to-emerald-500/10' 
                : 'border-red-400/50 bg-gradient-to-br from-red-500/20 via-red-400/10 to-pink-500/10'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  isCorrect 
                    ? 'border-green-400 bg-green-400 text-white' 
                    : 'border-red-400 bg-red-400 text-white'
                }`}>
                  {isCorrect ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  )}
                </div>
                
                <div className="flex-1">
                  <h5 className={`text-lg font-bold mb-2 ${
                    isCorrect ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {isCorrect ? '🎉 Tebrikler! Doğru cevap!' : '🤔 Yanlış cevap!'}
                  </h5>
                  
                  {!isCorrect && (
                    <p className="text-green-300 mb-3">
                      <strong>Doğru cevap:</strong> {String.fromCharCode(65 + currentQ.correctAnswer)} - {currentQ.options[currentQ.correctAnswer]}
                    </p>
                  )}
                  
                  {currentQ.explanation && (
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h6 className="text-blue-300 font-semibold">Açıklama</h6>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {currentQuestion === quiz.questions.length - 1 
                        ? 'Son soru! Quiz sonuçlarını görmek için bekleyin...' 
                        : 'Bir sonraki soruya otomatik olarak geçilecek...'}
                    </div>
                    <button
                      onClick={skipToNextQuestion}
                      className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-white rounded-lg transition-all duration-200 text-sm"
                    >
                      {currentQuestion === quiz.questions.length - 1 ? 'Sonuçları Göster' : 'Sonraki Soru'} →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Auto-advance after delay */}
            <div className="mt-4">
              <div className="w-full bg-slate-700/50 rounded-full h-1">
                <div 
                  className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1500 ease-linear"
                  style={{ width: showFeedback ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Navigation */}
        {!showFeedback && (
          <div className="text-center space-y-4">
            {displayCurrentAnswer === null && (
              <div className="inline-flex items-center px-6 py-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Cevabınızı seçin veya geçin
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button
                onClick={() => {
                  setCurrentQuestion(prev => prev - 1);
                  setShowFeedback(false);
                  setCurrentAnswer(null);
                }}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-slate-800/30 disabled:text-gray-500 border border-slate-600/50 hover:border-slate-500/50 disabled:border-slate-700/30 text-white rounded-lg transition-all duration-200 text-sm flex items-center"
              >
                ← Önceki
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={skipQuestion}
                  className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 hover:border-yellow-500/50 text-yellow-300 hover:text-yellow-200 rounded-lg transition-all duration-200 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Geç
                </button>
                
                {currentQuestion === quiz.questions.length - 1 ? (
                  <button
                    onClick={finishQuiz}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Bitir
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentQuestion(prev => prev + 1);
                      setShowFeedback(false);
                      setCurrentAnswer(null);
                    }}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-white rounded-lg transition-all duration-200 text-sm flex items-center"
                  >
                    Sonraki →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
