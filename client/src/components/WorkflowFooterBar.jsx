import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { WORKFLOW_STEPS } from './WorkflowStepper';

export const WorkflowFooterBar = ({ 
  currentStep = 1,
  nextLabel,
  prevLabel,
  onNext,
  nextDisabled = false,
  highlightText
}) => {
  const navigate = useNavigate();

  const prevStep = currentStep > 1 ? WORKFLOW_STEPS[currentStep - 2] : null;
  const nextStep = currentStep < WORKFLOW_STEPS.length ? WORKFLOW_STEPS[currentStep] : null;

  const handlePrev = () => {
    if (prevStep) {
      navigate(prevStep.path);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextStep) {
      navigate(nextStep.path);
    } else {
      // Completed all 7 steps!
      navigate('/profile');
    }
  };

  return (
    <div className="mt-12 pt-6 border-t border-slate-200">
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Previous step */}
        <div>
          {prevStep ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs sm:text-sm font-semibold transition-all border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {prevLabel || `Back to Step ${prevStep.step}: ${prevStep.title}`}
              </span>
            </button>
          ) : (
            <div className="text-xs text-sky-300 font-semibold flex items-center gap-1.5">
              <span>🚀 You are at Step 1 of your Employability Journey</span>
            </div>
          )}
        </div>

        {/* Center: Stage Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Workflow Step {currentStep} of 7</span>
          </div>
          <p className="text-xs text-slate-300 hidden sm:block">
            {highlightText || `Completed ${WORKFLOW_STEPS[currentStep - 1]?.title}`}
          </p>
        </div>

        {/* Right: Next step */}
        <div>
          <button
            type="button"
            onClick={handleNext}
            disabled={nextDisabled}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>
              {nextLabel || (nextStep ? `Proceed to Step ${nextStep.step}: ${nextStep.title}` : 'Complete Workflow 🎉')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
