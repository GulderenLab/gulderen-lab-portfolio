// Quiz System JavaScript
let currentQuiz = null;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let isQuizCompleted = false;
let startTime = null;

// Quiz configurations
const QUIZ_CONFIGS = {
    'x-ray-physics-quiz': {
        title: 'X-Ray Fiziği Quiz',
        description: 'X-ışını üretimi, madde etkileşimleri ve görüntü oluşumu hakkında bilginizi test edin',
        category: 'x-ray-physics'
    },
    'ct-physics-quiz': {
        title: 'BT Fiziği Quiz', 
        description: 'Bilgisayarlı tomografi prensipleri ve teknikleri hakkında quiz',
        category: 'ct-physics'
    },
    'mri-physics-quiz': {
        title: 'MRG Fiziği Quiz',
        description: 'Manyetik rezonans görüntüleme prensipleri quiz',
        category: 'mri-physics'
    },
    'mammography-physics-quiz': {
        title: 'Mamografi Fiziği Quiz',
        description: 'Meme görüntüleme fiziği ve optimizasyon teknikleri',
        category: 'mammography-physics'
    },
    'ultrasound-physics-quiz': {
        title: 'Ultrason Fiziği Quiz',
        description: 'Ultrason prensipleri ve Doppler uygulamaları',
        category: 'ultrasound-physics'
    },
    'fluoroscopy-physics-quiz': {
        title: 'Floroskopi Fiziği Quiz',
        description: 'Gerçek zamanlı görüntüleme ve radyasyon yönetimi',
        category: 'fluoroscopy-physics'
    }
};

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});

async function initializeQuiz() {
    try {
        // Get quiz type from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const quizType = urlParams.get('quiz');
        
        if (!quizType || !QUIZ_CONFIGS[quizType]) {
            showError('Quiz tipi bulunamadı. Lütfen geçerli bir quiz seçin.');
            return;
        }
        
        currentQuiz = quizType;
        const config = QUIZ_CONFIGS[quizType];
        
        // Update UI with quiz info
        document.getElementById('quiz-title').textContent = config.title;
        document.getElementById('quiz-description').textContent = config.description;
        
        // Load questions
        await loadQuestions(config.category);
        
        // Initialize quiz state
        currentQuestionIndex = 0;
        userAnswers = new Array(questions.length).fill(null);
        startTime = new Date();
        
        // Show quiz content and hide loading
        document.getElementById('loading').style.display = 'none';
        document.getElementById('quiz-content').style.display = 'block';
        
        // Display first question
        displayQuestion();
        updateProgress();
        
    } catch (error) {
        console.error('Quiz initialization error:', error);
        showError('Quiz yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
}

async function loadQuestions(category) {
    try {
        // In a real app, this would fetch from an API or database
        questions = getQuestionsForCategory(category);
        
        if (questions.length === 0) {
            throw new Error('No questions found for category: ' + category);
        }
        
        // Shuffle questions for variety
        shuffleArray(questions);
        
    } catch (error) {
        throw new Error('Failed to load questions: ' + error.message);
    }
}

function getQuestionsForCategory(category) {
    const questionBank = {
        'x-ray-physics': [
            {
                question: "X-ışını üretiminde bremsstrahlung radyasyonunun yüzdesi yaklaşık kaçtır?",
                options: ["75%", "85%", "95%", "99%"],
                correct: 3,
                explanation: "X-ışını üretiminde yaklaşık %99'u bremsstrahlung (fren radyasyonu), %1'i karakteristik radyasyondur."
            },
            {
                question: "Fotoelektrik etkinin atom numarası ile ilişkisi nasıldır?",
                options: ["Z ile orantılı", "Z² ile orantılı", "Z³ ile orantılı", "Z⁴ ile orantılı"],
                correct: 3,
                explanation: "Fotoelektrik soğurma atom numarasının 4. kuvveti (Z⁴) ile orantılıdır."
            },
            {
                question: "Compton saçılmasında saçılan fotonun enerjisi neye bağlıdır?",
                options: ["Sadece gelen foton enerjisine", "Saçılma açısına", "Elektron hızına", "Atom numarasına"],
                correct: 1,
                explanation: "Compton saçılmasında saçılan fotonun enerjisi saçılma açısına bağlıdır. Büyük açılarda daha düşük enerjili fotonlar elde edilir."
            },
            {
                question: "X-ışını tüpünde anot materyali olarak tungsten tercih edilmesinin nedeni nedir?",
                options: ["Düşük erime noktası", "Yüksek atom numarası", "Düşük maliyet", "Kolay işlenebilirlik"],
                correct: 1,
                explanation: "Tungsten (Z=74) yüksek atom numarası, yüksek erime noktası ve iyi termal iletkenlik özelliklerine sahiptir."
            },
            {
                question: "Lambert-Beer kanununa göre X-ışını zayıflaması hangi faktörlere bağlıdır?",
                options: ["Sadece kalınlık", "Sadece zayıflama katsayısı", "Kalınlık ve zayıflama katsayısı", "Sadece gelen ışın şiddeti"],
                correct: 2,
                explanation: "I = I₀ × e^(-μx) formülünde μ lineer zayıflama katsayısı ve x madde kalınlığıdır."
            },
            {
                question: "Düşük kVp kullanımının avantajı nedir?",
                options: ["Yüksek penetrasyon", "Düşük kontrast", "Yüksek kontrast", "Düşük hasta dozu"],
                correct: 2,
                explanation: "Düşük kVp fotoelektrik etkiyi artırarak daha yüksek kontrast sağlar, özellikle kemik-yumuşak doku ayrımında."
            },
            {
                question: "Grid kullanımının birincil amacı nedir?",
                options: ["Hasta dozunu azaltmak", "Scatter radyasyonu azaltmak", "X-ışını miktarını artırmak", "Ekspozür süresini kısaltmak"],
                correct: 1,
                explanation: "Grid, scatter radyasyonu absorbe ederek görüntü kontrastını artırmak için kullanılır."
            },
            {
                question: "Karakteristik X-ışınlarının oluşumu için gereken minimum kVp tungsten için kaç kV'dir?",
                options: ["50 kV", "69.5 kV", "80 kV", "100 kV"],
                correct: 1,
                explanation: "Tungsten K-edge değeri 69.5 keV'dir. Karakteristik radyasyon üretimi için bu değerin üstünde enerji gerekir."
            },
            {
                question: "Filtrasyon kullanımının faydası nedir?",
                options: ["X-ışını miktarını artırmak", "Beam hardening sağlamak", "Ekspozür süresini kısaltmak", "Grid etkisini artırmak"],
                correct: 1,
                explanation: "Filtrasyon düşük enerjili X-ışınlarını absorbe ederek beam hardening sağlar ve hasta dozunu azaltır."
            },
            {
                question: "ALARA prensibinin açılımı nedir?",
                options: ["As Low As Reasonably Achievable", "Always Look At Radiation Annually", "As Limited As Radiation Allows", "All Levels Are Radiation Approved"],
                correct: 0,
                explanation: "ALARA: As Low As Reasonably Achievable - Makul ölçüde ulaşılabilir en düşük düzey prensibidir."
            }
        ],
        'ct-physics': [
            {
                question: "BT görüntülemede Hounsfield ünite (HU) değeri neyi ifade eder?",
                options: ["Radyasyon dozu", "Lineer zayıflama katsayısı", "Kontrast çözünürlük", "Spatial rezolüsyon"],
                correct: 1,
                explanation: "HU değeri dokunun lineer zayıflama katsayısının suya göre göreceli değeridir."
            },
            {
                question: "Spiral BT'de pitch kavramı neyi ifade eder?",
                options: ["Detektör boyutu", "Tablo hareket hızı/kollimation genişliği", "X-ışını enerjisi", "Rekonstrüksiyon zamanı"],
                correct: 1,
                explanation: "Pitch = Tablo hareket hızı / Kollimation genişliği oranıdır."
            },
            {
                question: "BT görüntülemede filtere back-projection algoritmasının amacı nedir?",
                options: ["Görüntü kalitesini azaltmak", "Tomografik görüntü rekonstrüksiyonu", "Radyasyon dozunu artırmak", "Kontrast azaltmak"],
                correct: 1,
                explanation: "Bu algoritma projeksiyonlardan tomografik kesit görüntülerini yeniden oluşturur."
            }
        ],
        'mri-physics': [
            {
                question: "MRG'de T1 relaxation zamanı neyi ifade eder?",
                options: ["Spin-spin relaxation", "Longitudinal relaxation", "Transverse relaxation", "Gradient relaxation"],
                correct: 1,
                explanation: "T1, longitudinal veya spin-lattice relaxation zamanıdır."
            },
            {
                question: "1.5 Tesla MRG sistemi için protonların Larmor frekansı yaklaşık kaçtır?",
                options: ["42 MHz", "63 MHz", "128 MHz", "200 MHz"],
                correct: 1,
                explanation: "1.5T'da Larmor frekansı ≈ 63 MHz'dir (42.58 MHz/T × 1.5T)."
            }
        ],
        'mammography-physics': [
            {
                question: "Mamografi için optimal kVp aralığı nedir?",
                options: ["15-20 kVp", "25-30 kVp", "35-40 kVp", "45-50 kVp"],
                correct: 1,
                explanation: "Mamografide düşük kontrast dokular için 25-30 kVp aralığı optimal kontrastı sağlar."
            }
        ],
        'ultrasound-physics': [
            {
                question: "Ultrason dalgalarının frekans aralığı nedir?",
                options: ["1-5 MHz", "2-15 MHz", "20-50 MHz", "100-200 MHz"],
                correct: 1,
                explanation: "Tanısal ultrasonografia için genellikle 2-15 MHz arası frekanslar kullanılır."
            }
        ],
        'fluoroscopy-physics': [
            {
                question: "Floroskopide automatic brightness control (ABC) sisteminin amacı nedir?",
                options: ["Hasta dozunu artırmak", "Görüntü parlaklığını sabit tutmak", "Kontrastu azaltmak", "Ekspozür süresini uzatmak"],
                correct: 1,
                explanation: "ABC sistemi hasta kalınlığına göre teknik faktörleri otomatik ayarlayarak görüntü parlaklığını sabit tutar."
            }
        ]
    };
    
    return questionBank[category] || [];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    const container = document.getElementById('question-container');
    
    container.innerHTML = `
        <div class="question-number">Soru ${currentQuestionIndex + 1}</div>
        <div class="question-text">${question.question}</div>
        <div class="answers-container">
            ${question.options.map((option, index) => `
                <div class="answer-option" onclick="selectAnswer(${index})">
                    <div class="answer-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="answer-text">${option}</div>
                </div>
            `).join('')}
        </div>
        <div id="explanation-${currentQuestionIndex}" class="explanation">
            <strong>Açıklama:</strong> ${question.explanation}
        </div>
    `;
    
    // Restore previous answer if exists
    if (userAnswers[currentQuestionIndex] !== null) {
        selectAnswer(userAnswers[currentQuestionIndex], false);
    }
    
    updateNavigationButtons();
}

function selectAnswer(answerIndex, recordAnswer = true) {
    // Clear previous selections
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Mark selected answer
    const selectedOption = document.querySelectorAll('.answer-option')[answerIndex];
    selectedOption.classList.add('selected');
    
    if (recordAnswer) {
        userAnswers[currentQuestionIndex] = answerIndex;
        
        // Enable next button
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.disabled = false;
        }
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgress();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgress();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `${currentQuestionIndex + 1}/${questions.length}`;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    
    const hasAnswer = userAnswers[currentQuestionIndex] !== null;
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = hasAnswer ? 'inline-flex' : 'none';
    } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.disabled = !hasAnswer;
        submitBtn.style.display = 'none';
    }
}

function submitQuiz() {
    if (userAnswers.some(answer => answer === null)) {
        if (!confirm('Bazı sorular cevaplanmamış. Quiz\'i yine de bitirmek istiyor musunuz?')) {
            return;
        }
    }
    
    isQuizCompleted = true;
    calculateAndShowResults();
}

function calculateAndShowResults() {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // seconds
    
    let correctCount = 0;
    
    // Calculate score
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            correctCount++;
        }
    });
    
    const totalQuestions = questions.length;
    const incorrectCount = totalQuestions - correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Store results in localStorage
    const result = {
        quiz: currentQuiz,
        score: percentage,
        correct: correctCount,
        incorrect: incorrectCount,
        total: totalQuestions,
        timeSpent: timeSpent,
        date: new Date().toISOString(),
        answers: userAnswers.map((answer, index) => ({
            question: questions[index].question,
            userAnswer: answer,
            correctAnswer: questions[index].correct,
            isCorrect: answer === questions[index].correct
        }))
    };
    
    saveQuizResult(result);
    
    // Update UI
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    
    document.getElementById('final-score').textContent = percentage + '%';
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('success-rate').textContent = percentage + '%';
    
    const message = getScoreMessage(percentage);
    document.getElementById('score-message').textContent = message;
}

function getScoreMessage(percentage) {
    if (percentage >= 90) return "Mükemmel! Radyoloji fizik bilginiz çok iyi.";
    if (percentage >= 80) return "Çok iyi! Başarılı bir performans sergiledینiz.";
    if (percentage >= 70) return "İyi! Konuları tekrar etmenizi öneririz.";
    if (percentage >= 60) return "Orta seviye. Daha fazla çalışma yapmanız faydalı olacaktır.";
    return "Konuları yeniden çalışmanızı öneriyoruz.";
}

function saveQuizResult(result) {
    const results = getStoredResults();
    results.push(result);
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    // Update completed quizzes list
    const completed = getCompletedQuizzes();
    if (!completed.includes(currentQuiz)) {
        completed.push(currentQuiz);
        localStorage.setItem('completedPhysicsQuizzes', JSON.stringify(completed));
    }
}

function getStoredResults() {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : [];
}

function getCompletedQuizzes() {
    const completed = localStorage.getItem('completedPhysicsQuizzes');
    return completed ? JSON.parse(completed) : [];
}

function reviewAnswers() {
    // Show detailed review of all answers
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    
    // Enable review mode
    reviewMode();
}

function reviewMode() {
    currentQuestionIndex = 0;
    displayReviewQuestion();
    
    // Update navigation for review
    const controls = document.querySelector('.quiz-controls');
    controls.innerHTML = `
        <button id="prev-review-btn" class="btn btn-secondary" onclick="previousReview()" disabled>
            <i class="fas fa-arrow-left"></i> Önceki
        </button>
        <span>İnceleme Modu: ${currentQuestionIndex + 1}/${questions.length}</span>
        <button id="next-review-btn" class="btn btn-primary" onclick="nextReview()">
            Sonraki <i class="fas fa-arrow-right"></i>
        </button>
        <button class="btn btn-secondary" onclick="backToResults()">
            <i class="fas fa-chart-bar"></i> Sonuçlara Dön
        </button>
    `;
}

function displayReviewQuestion() {
    const question = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];
    const correctAnswer = question.correct;
    const container = document.getElementById('question-container');
    
    container.innerHTML = `
        <div class="question-number">Soru ${currentQuestionIndex + 1} - İnceleme</div>
        <div class="question-text">${question.question}</div>
        <div class="answers-container">
            ${question.options.map((option, index) => {
                let className = 'answer-option';
                if (index === correctAnswer) className += ' correct';
                if (index === userAnswer && index !== correctAnswer) className += ' incorrect';
                if (index === userAnswer) className += ' selected';
                
                return `
                    <div class="${className}">
                        <div class="answer-letter">${String.fromCharCode(65 + index)}</div>
                        <div class="answer-text">${option}</div>
                        ${index === correctAnswer ? '<i class="fas fa-check" style="color: green; margin-left: auto;"></i>' : ''}
                        ${index === userAnswer && index !== correctAnswer ? '<i class="fas fa-times" style="color: red; margin-left: auto;"></i>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="explanation show">
            <strong>Açıklama:</strong> ${question.explanation}
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
            <strong>Sonuç:</strong> ${userAnswer === correctAnswer ? 
                '<span style="color: green;"><i class="fas fa-check"></i> Doğru cevap</span>' : 
                `<span style="color: red;"><i class="fas fa-times"></i> Yanlış cevap. Doğru cevap: ${String.fromCharCode(65 + correctAnswer)}</span>`}
        </div>
    `;
    
    // Update review navigation
    const prevBtn = document.getElementById('prev-review-btn');
    const nextBtn = document.getElementById('next-review-btn');
    
    if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
    if (nextBtn) nextBtn.disabled = currentQuestionIndex === questions.length - 1;
}

function nextReview() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayReviewQuestion();
    }
}

function previousReview() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayReviewQuestion();
    }
}

function backToResults() {
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
}

function restartQuiz() {
    if (confirm('Quiz\'i yeniden başlatmak istediğinizden emin misiniz?')) {
        location.reload();
    }
}

function showError(message) {
    document.getElementById('loading').innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <a href="radiology-physics.html" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i> Geri Dön
            </a>
        </div>
    `;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectAnswer,
        calculateResults: calculateAndShowResults,
        getQuestionsForCategory
    };
}
