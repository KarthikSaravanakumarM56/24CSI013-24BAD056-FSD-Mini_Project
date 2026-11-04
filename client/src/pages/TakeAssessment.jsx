import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Award, 
  HelpCircle, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const TakeAssessment = () => {
  const { id } = useParams();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const res = await api.getAssessmentById(id);
        if (res.success) {
          setAssessment(res.assessment);
          setTimeLeft((res.assessment.durationMinutes || 15) * 60);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!assessment || result) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, result]);

  const handleSelectOption = (questionIdx, optionIdx) => {
    if (result) return;
    setAnswers({
      ...answers,
      [questionIdx]: optionIdx
    });
  };

  const handleSubmit = async () => {
    if (submitting || result) return;
    setSubmitting(true);

    try {
      const answersArray = assessment.questions.map((_, idx) => 
        answers[idx] !== undefined ? answers[idx] : -1
      );

      const res = await api.submitAssessment(id, answersArray);
      if (res.success) {
        setResult(res);
        if (res.passed) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
          await refreshUser();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Preparing assessment questions...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-slate-600">Assessment not found.</p>
        <Link to="/assessments" className="text-brand-600 underline text-sm mt-2 block">
          Back to Assessments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar: Title & Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link to="/assessments" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{assessment.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Passing Score: {assessment.passingScorePercent}%</p>
        </div>

        {!result && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-sm font-bold rounded-2xl shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Result Card if Submitted */}
      {result ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in fade-in">
          <div className="text-center space-y-3">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black ${
              result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {result.scorePercent}%
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {result.passed ? '🎉 Congratulations! You Passed!' : 'Keep Practicing!'}
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              You answered {result.correctCount} out of {result.totalQuestions} questions correctly.
              {result.passed && ' A verified skill badge has been added to your profile!'}
            </p>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                to="/profile"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow"
              >
                View Profile & Badges
              </Link>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setTimeLeft((assessment.durationMinutes || 15) * 60);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Test
              </button>
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Question-by-Question Detailed Review</h3>
            {result.details?.map((q, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${
                  q.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                } space-y-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-800">
                    <span className="text-slate-400 mr-1.5">Q{idx + 1}.</span>
                    {q.questionText}
                  </p>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {q.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                  </span>
                </div>

                {q.explanation && (
                  <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Question List for Taking Test */
        <div className="space-y-8">
          {assessment.questions.map((q, qIdx) => (
            <div
              key={q._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900 flex items-start gap-2">
                <span className="text-brand-600 font-extrabold">Q{qIdx + 1}.</span>
                <span className="whitespace-pre-line">{q.questionText}</span>
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[qIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-sm'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-brand-600 text-white' : 'bg-white border border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Answered {Object.keys(answers).length} of {assessment.questions.length} questions
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-7 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
