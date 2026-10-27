import { useEffect, useMemo, useRef, useState } from "react"
import "./App.css"

const QUESTIONS = [
  {
    category: "Логика",
    q: "Какое число должно быть следующим: 2, 4, 8, 16, ...?",
    options: ["18", "24", "32", "30"],
    answer: 2,
    explanation: "Каждое число умножается на 2.",
  },
  {
    category: "Логика",
    q: "У стола 4 угла. Один угол отпилили. Сколько углов стало?",
    options: ["3", "4", "5", "6"],
    answer: 2,
    explanation: "После среза появляется новый угол: всего 5.",
  },
  {
    category: "Логика",
    q: "Что тяжелее: килограмм железа или килограмм ваты?",
    options: ["Железо", "Вата", "Одинаково", "Нельзя узнать"],
    answer: 2,
    explanation: "Оба весят ровно один килограмм.",
  },
  {
    category: "География",
    q: "Какая страна имеет форму сапога?",
    options: ["Испания", "Италия", "Греция", "Португалия"],
    answer: 1,
    explanation: "На карте Италия напоминает сапог.",
  },
  {
    category: "География",
    q: "Какой океан самый большой?",
    options: [
      "Атлантический",
      "Индийский",
      "Северный Ледовитый",
      "Тихий",
    ],
    answer: 3,
    explanation: "Тихий океан — крупнейший океан Земли.",
  },
  {
    category: "Наука",
    q: "Какая планета известна как Красная планета?",
    options: ["Венера", "Марс", "Юпитер", "Меркурий"],
    answer: 1,
    explanation: "Поверхность Марса содержит оксиды железа.",
  },
  {
    category: "Наука",
    q: "Какой газ растения поглощают при фотосинтезе?",
    options: ["Кислород", "Азот", "Углекислый газ", "Водород"],
    answer: 2,
    explanation:
      "Для фотосинтеза растения используют углекислый газ.",
  },
  {
    category: "IT",
    q: "Что означает HTML?",
    options: [
      "HyperText Markup Language",
      "High Transfer Machine Link",
      "Home Tool Markup Language",
      "Hyper Trainer Main Language",
    ],
    answer: 0,
    explanation: "HTML — язык разметки веб-страниц.",
  },
  {
    category: "IT",
    q: "Какой язык используют для интерактивности на сайте?",
    options: ["CSS", "JavaScript", "SQL", "XML"],
    answer: 1,
    explanation: "JavaScript добавляет логику и интерактивность.",
  },
  {
    category: "История",
    q: "Где появились первые Олимпийские игры древности?",
    options: ["Египет", "Греция", "Италия", "Китай"],
    answer: 1,
    explanation: "Древние Олимпийские игры проходили в Греции.",
  },
  {
    category: "English A2–B1",
    q: "Choose the correct sentence:",
    options: [
      "She go to school.",
      "She goes to school.",
      "She going school.",
      "She gone to school.",
    ],
    answer: 1,
    explanation:
      "В Present Simple с he/she/it к глаголу добавляется -s.",
  },
  {
    category: "English A2–B1",
    q: "What is the opposite of difficult?",
    options: ["Easy", "Strong", "Late", "Slow"],
    answer: 0,
    explanation: "Difficult — сложный, easy — лёгкий.",
  },
  {
    category: "Поп-культура",
    q: "Как называется история о супергероях в картинках?",
    options: ["Роман", "Комикс", "Атлас", "Словарь"],
    answer: 1,
    explanation:
      "Комикс рассказывает историю с помощью изображений и текста.",
  },
  {
    category: "Спорт",
    q: "Сколько игроков одной футбольной команды находится на поле?",
    options: ["9", "10", "11", "12"],
    answer: 2,
    explanation:
      "В стандартном футболе на поле 11 игроков от каждой команды.",
  },
];

const CATEGORIES = [
  ["🎲", "Все"],
  ["🧠", "Логика"],
  ["🌍", "География"],
  ["🔬", "Наука"],
  ["💻", "IT"],
  ["🏛️", "История"],
  ["🇬🇧", "English A2–B1"],
  ["🎬", "Поп-культура"],
  ["🏆", "Спорт"],
];

const MODES = [
  {
    id: "Classic",
    icon: "⚡",
    title: "Classic",
    desc: "Очки + бонус за скорость",
  },
  {
    id: "Blitz",
    icon: "🔥",
    title: "Blitz",
    desc: "8 секунд на вопрос",
  },
  {
    id: "Survival",
    icon: "💗",
    title: "Survival",
    desc: "До трёх ошибок",
  },
  {
    id: "Exam",
    icon: "📝",
    title: "Exam",
    desc: "Без таймера, итог в %",
  },
];

function readStats() {
  try {
    return JSON.parse(localStorage.getItem("quizstorm-stats")) || {};
  } catch {
    return {};
  }
}

export default function App() {
  const [nickname, setNickname] = useState(
    localStorage.getItem("quizstorm-name") || ""
  );

  const [mode, setMode] = useState("Classic");
  const [category, setCategory] = useState("Логика");
  const [amount, setAmount] = useState(30);
  const [seconds, setSeconds] = useState(15);

  const [sound, setSound] = useState(true);
  const [light, setLight] = useState(false);

  const [screen, setScreen] = useState("home");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(readStats);
  const [showCards, setShowCards] = useState(false);

  const timerRef = useRef(null);
  const current = questions[index];

  const xp = stats.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;

  const allQuestions = useMemo(
    () =>
      category === "Все"
        ? QUESTIONS
        : QUESTIONS.filter((q) => q.category === category),
    [category]
  );

  useEffect(() => {
    localStorage.setItem("quizstorm-name", nickname);
  }, [nickname]);

  useEffect(() => {
    localStorage.setItem("quizstorm-stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (
      screen !== "playing" ||
      !current ||
      selected !== null ||
      mode === "Exam"
    ) {
      return;
    }

    setTimeLeft(mode === "Blitz" ? 8 : seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setSelected(-1);
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [screen, index, selected, mode, seconds, current]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function startGame() {
    if (!nickname.trim()) return;

    const pool = [...allQuestions].sort(() => Math.random() - 0.5);
    const list = pool.slice(0, Math.min(Number(amount), pool.length));

    if (!list.length) return;

    setQuestions(list);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setCorrect(0);
    setMistakes(0);
    setHistory([]);

    setTimeLeft(mode === "Blitz" ? 8 : seconds);
    setScreen("playing");
    setShowCards(false);
  }

  function answerQuestion(choice) {
    if (selected !== null || !current) return;

    clearInterval(timerRef.current);
    setSelected(choice);

    const isCorrect = choice === current.answer;

    const gained = isCorrect
      ? 100 + (mode === "Classic" ? Math.max(0, timeLeft) * 5 : 0)
      : 0;

    if (isCorrect) {
      setScore((s) => s + gained);
      setCorrect((c) => c + 1);
    } else {
      setMistakes((m) => m + 1);
    }

    setHistory((h) => [
      ...h,
      {
        question: current.q,
        chosen: choice,
        answer: current.answer,
        isCorrect,
        explanation: current.explanation,
      },
    ]);
  }

  function nextQuestion() {
    if (mode === "Survival" && mistakes >= 3) {
      finishGame();
      return;
    }

    if (index + 1 >= questions.length) {
      finishGame();
      return;
    }

    setIndex((i) => i + 1);
    setSelected(null);
  }

  function finishGame() {
    clearInterval(timerRef.current);

    const earned = score + correct * 10;

    setStats((old) => ({
      ...old,
      xp: (old.xp || 0) + earned,
      record: Math.max(old.record || 0, score),
      streak: (old.streak || 0) + 1,
      games: (old.games || 0) + 1,
      bestPercent: Math.max(
        old.bestPercent || 0,
        Math.round((correct / Math.max(questions.length, 1)) * 100)
      ),
    }));

    setScreen("results");
  }

  function restartHome() {
    clearInterval(timerRef.current);
    setScreen("home");
    setSelected(null);
    setShowCards(false);
  }

  const progress = questions.length
    ? ((index + (selected !== null ? 1 : 0)) / questions.length) * 100
    : 0;

  return (
    <main className={`app ${light ? "light" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="shell">
        <header className="topbar">
          <button className="brand" onClick={restartHome}>
            <span className="brand-icon">🌧️</span>
            <span>QuizStorm</span>
          </button>

          <div className="top-actions">
            <button
              className="icon-btn"
              title="Звук"
              onClick={() => setSound((v) => !v)}
            >
              {sound ? "🔊" : "🔇"}
            </button>

            <button
              className="icon-btn"
              title="Тема"
              onClick={() => setLight((v) => !v)}
            >
              {light ? "🌙" : "☼"}
            </button>
          </div>
        </header>

        {screen === "home" && (
          <>
            <section className="hero">
              <h1>
                Think fast. <span>Learn more.</span> Win together.
              </h1>

              <div className="profile panel">
                <input
                  value={nickname}
                  onChange={(e) =>
                    setNickname(e.target.value.slice(0, 20))
                  }
                  placeholder="Твой никнейм"
                  maxLength={20}
                />

                <div className="level-row">
                  <b>Уровень {level}</b>

                  <div className="xp-track">
                    <i style={{ width: `${xpInLevel / 5}%` }} />
                  </div>

                  <b>{xpInLevel}/500 XP</b>
                </div>

                <div className="stats-line">
                  <span>🏆 Рекорд: {stats.record || 0}</span>
                  <span>♨️ Серия дней: {stats.streak || 0}</span>
                  <span>🎮 Игр: {stats.games || 0}</span>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Режим</h2>

              <div className="mode-grid">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    className={`mode-card ${
                      mode === m.id ? "active" : ""
                    }`}
                    onClick={() => setMode(m.id)}
                  >
                    <strong>
                      {m.icon} &nbsp;{m.title}
                    </strong>

                    <small>{m.desc}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="section">
              <h2>Категория · вопросов: {allQuestions.length}</h2>

              <div className="category-list">
                {CATEGORIES.map(([icon, name]) => (
                  <button
                    key={name}
                    className={`chip ${
                      category === name ? "chosen" : ""
                    }`}
                    onClick={() => setCategory(name)}
                  >
                    {icon} {name}
                  </button>
                ))}
              </div>

              <div className="settings-row">
                <label>
                  Вопросов
                  <select
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                </label>

                <label>
                  Таймер
                  <select
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                  >
                    <option value="10">10 с</option>
                    <option value="15">15 с</option>
                    <option value="20">20 с</option>
                    <option value="30">30 с</option>
                  </select>
                </label>
              </div>

              <div className="main-actions">
                <button
                  className="primary"
                  onClick={startGame}
                  disabled={!nickname.trim()}
                >
                  ▶ Начать игру
                </button>

                <button
                  className="secondary"
                  onClick={() => setShowCards((v) => !v)}
                >
                  🗂️ Карточки
                </button>

                <button
                  className="secondary"
                  onClick={() => setScreen("stats")}
                >
                  📊 Результаты
                </button>
              </div>

              {!nickname.trim() && (
                <p className="hint">Введи никнейм, чтобы начать.</p>
              )}

              {showCards && (
                <div className="flashcards">
                  {allQuestions.slice(0, 6).map((q, i) => (
                    <article className="flashcard" key={q.q}>
                      <span>
                        Карточка {i + 1} · {q.category}
                      </span>

                      <b>{q.q}</b>

                      <details>
                        <summary>Показать ответ</summary>
                        <p>{q.options[q.answer]}</p>
                        <small>{q.explanation}</small>
                      </details>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="section">
              <h2>Достижения</h2>

              <div className="achievement-grid">
                <div
                  className={`achievement ${
                    correct >= 1 ? "unlocked" : ""
                  }`}
                >
                  <span>🎯</span>
                  <b>Первый шаг</b>
                  <small>Ответь правильно на вопрос</small>
                </div>

                <div
                  className={`achievement ${
                    (stats.games || 0) >= 5 ? "unlocked" : ""
                  }`}
                >
                  <span>🔥</span>
                  <b>На волне</b>
                  <small>Сыграй 5 игр</small>
                </div>

                <div
                  className={`achievement ${
                    (stats.record || 0) >= 500 ? "unlocked" : ""
                  }`}
                >
                  <span>🏆</span>
                  <b>Чемпион</b>
                  <small>Набери 500 очков за игру</small>
                </div>

                <div
                  className={`achievement ${
                    level >= 3 ? "unlocked" : ""
                  }`}
                >
                  <span>🚀</span>
                  <b>Взлёт</b>
                  <small>Достигни 3 уровня</small>
                </div>
              </div>
            </section>
          </>
        )}

        {screen === "playing" && current && (
          <section className="game-panel panel">
            <div className="game-top">
              <span className="pill">
                {mode === "Exam"
                  ? "📝 Exam"
                  : `${MODES.find((m) => m.id === mode)?.icon} ${mode}`}
              </span>

              <span>
                Вопрос {index + 1} из {questions.length}
              </span>

              <b>⭐ {score}</b>
            </div>

            <div className="progress">
              <i style={{ width: `${progress}%` }} />
            </div>

            <div className="question-meta">
              {current.category}
              <span>
                {mode !== "Exam" ? `⏱ ${timeLeft} с` : "Без таймера"}
              </span>
            </div>

            <h2 className="question-title">{current.q}</h2>

            <div className="answer-grid">
              {current.options.map((option, i) => {
                let cls = "answer";

                if (selected !== null && i === current.answer) {
                  cls += " correct";
                } else if (selected === i) {
                  cls += " wrong";
                }

                return (
                  <button
                    key={option}
                    className={cls}
                    disabled={selected !== null}
                    onClick={() => answerQuestion(i)}
                  >
                    <span>{String.fromCharCode(65 + i)}</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className="feedback">
                <b>
                  {selected === current.answer
                    ? "✨ Верно! Отличная работа."
                    : selected === -1
                    ? "⏰ Время вышло!"
                    : "💡 Не совсем!"}
                </b>

                {mode !== "Exam" && <p>{current.explanation}</p>}

                <button className="primary" onClick={nextQuestion}>
                  {index + 1 === questions.length
                    ? "Завершить"
                    : "Следующий вопрос →"}
                </button>
              </div>
            )}

            <button className="text-btn" onClick={restartHome}>
              ← В меню
            </button>
          </section>
        )}

        {screen === "results" && (
          <section className="result-panel panel">
            <div className="result-emoji">
              {correct / Math.max(questions.length, 1) >= 0.8
                ? "🏆"
                : "🌟"}
            </div>

            <p className="eyebrow">ИГРА ЗАВЕРШЕНА</p>
            <h1>{nickname}, отличный раунд!</h1>
            <p className="muted">Твой результат в QuizStorm</p>

            <div className="result-stats">
              <div>
                <b>{score}</b>
                <span>Очки</span>
              </div>

              <div>
                <b>
                  {correct}/{questions.length}
                </b>
                <span>Верных ответов</span>
              </div>

              <div>
                <b>
                  {Math.round(
                    (correct / Math.max(questions.length, 1)) * 100
                  )}
                  %
                </b>
                <span>Точность</span>
              </div>
            </div>

            <div className="result-actions">
              <button className="primary" onClick={startGame}>
                ↻ Играть снова
              </button>

              <button
                className="secondary"
                onClick={() => setScreen("review")}
              >
                📋 Разбор ответов
              </button>

              <button className="secondary" onClick={restartHome}>
                ⌂ В меню
              </button>
            </div>
          </section>
        )}

        {screen === "review" && (
          <section className="section">
            <h1>Разбор ответов</h1>

            {history.map((h, i) => (
              <article
                className="review-card panel"
                key={`${h.question}-${i}`}
              >
                <b>
                  {i + 1}. {h.question}
                </b>

                <p className={h.isCorrect ? "good-text" : "bad-text"}>
                  {h.isCorrect ? "Верно" : "Неверно"} · Правильный ответ:{" "}
                  {questions[i]?.options[h.answer]}
                </p>

                <small>{h.explanation}</small>
              </article>
            ))}

            <button className="primary" onClick={restartHome}>
              ← В меню
            </button>
          </section>
        )}

        {screen === "stats" && (
          <section className="result-panel panel">
            <div className="result-emoji">📊</div>
            <h1>Твоя статистика</h1>

            <div className="result-stats">
              <div>
                <b>{stats.games || 0}</b>
                <span>Игр сыграно</span>
              </div>

              <div>
                <b>{stats.xp || 0}</b>
                <span>Всего XP</span>
              </div>

              <div>
                <b>{stats.bestPercent || 0}%</b>
                <span>Лучший результат</span>
              </div>
            </div>

            <button className="primary" onClick={restartHome}>
              ← В меню
            </button>

            <button
              className="reset-link"
              onClick={() => {
                if (confirm("Сбросить всю статистику?")) {
                  setStats({});
                  localStorage.removeItem("quizstorm-stats");
                }
              }}
            >
              Сбросить статистику
            </button>
          </section>
        )}

        <footer>
          © 2026 QuizStorm
          <span>Учись играя · Становись лучше каждый день</span>
        </footer>
      </div>
    </main>
  );
}