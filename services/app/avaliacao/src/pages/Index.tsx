import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { DisclaimerSection } from "@/components/DisclaimerSection";
import { PreparationStep } from "@/components/PreparationStep";
import { ProfileForm, UserProfile } from "@/components/ProfileForm";
import { QuestionnaireSection } from "@/components/QuestionnaireSection";
import { ReadingTest } from "@/components/ReadingTest";
import { FocusTest } from "@/components/FocusTest";
import { ContrastTest } from "@/components/ContrastTest";
import { AmslerTest } from "@/components/AmslerTest";
import { ResultsSection } from "@/components/ResultsSection";
import { calculateCategoryResults } from "@/lib/questions";
import { AllTestResults, calculateTestScores, ReadingTestResult, FocusTestResult, ContrastTestResult, AmslerTestResult } from "@/lib/visualTests";
import { determineProfile } from "@/lib/profileEngine";

type Step = "hero" | "disclaimer" | "preparation" | "profile" | "questionnaire" | "reading" | "focus" | "contrast" | "amsler" | "results";

const TOTAL_STEPS = 8;

const Index = () => {
  const [step, setStep] = useState<Step>("hero");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [tests, setTests] = useState<AllTestResults>({});

  const goTo = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProfileSubmit = (p: UserProfile) => { setProfile(p); goTo("questionnaire"); };
  const handleQuestionnaireComplete = (ans: Record<string, number>) => { setAnswers(ans); goTo("reading"); };
  const handleReadingComplete = (r: ReadingTestResult) => { setTests((prev) => ({ ...prev, reading: r })); goTo("focus"); };
  const handleFocusComplete = (r: FocusTestResult) => { setTests((prev) => ({ ...prev, focus: r })); goTo("contrast"); };
  const handleContrastComplete = (r: ContrastTestResult) => { setTests((prev) => ({ ...prev, contrast: r })); goTo("amsler"); };
  const handleAmslerComplete = (r: AmslerTestResult) => { setTests((prev) => ({ ...prev, amsler: r })); goTo("results"); };

  const handleRestart = () => {
    setProfile(null);
    setAnswers({});
    setTests({});
    goTo("hero");
  };

  if (step === "hero") return <HeroSection onStart={() => goTo("disclaimer")} />;
  if (step === "disclaimer") return <DisclaimerSection onAccept={() => goTo("preparation")} onBack={() => goTo("hero")} />;
  if (step === "preparation") return <PreparationStep onReady={() => goTo("profile")} onBack={() => goTo("disclaimer")} />;
  if (step === "profile") return <ProfileForm onSubmit={handleProfileSubmit} onBack={() => goTo("preparation")} />;
  if (step === "questionnaire") return <QuestionnaireSection onComplete={handleQuestionnaireComplete} onBack={() => goTo("profile")} totalSteps={TOTAL_STEPS} currentStep={4} />;
  if (step === "reading") return <ReadingTest onComplete={handleReadingComplete} onBack={() => goTo("questionnaire")} totalSteps={TOTAL_STEPS} currentStep={5} />;
  if (step === "focus") return <FocusTest onComplete={handleFocusComplete} onBack={() => goTo("reading")} totalSteps={TOTAL_STEPS} currentStep={6} />;
  if (step === "contrast") return <ContrastTest onComplete={handleContrastComplete} onBack={() => goTo("focus")} totalSteps={TOTAL_STEPS} currentStep={7} />;
  if (step === "amsler") return <AmslerTest onComplete={handleAmslerComplete} onBack={() => goTo("contrast")} totalSteps={TOTAL_STEPS} currentStep={8} />;

  const catResults = calculateCategoryResults(answers);
  const testScores = calculateTestScores(tests);
  const visualProfile = determineProfile(catResults, testScores, tests);

  return (
    <ResultsSection
      catResults={catResults}
      testScores={testScores}
      tests={tests}
      visualProfile={visualProfile}
      profile={profile!}
      onRestart={handleRestart}
    />
  );
};

export default Index;
