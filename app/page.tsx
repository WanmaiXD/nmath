import CounterNav from "@/components/nav/counterNav";
import QuestionRandomizer from "@/components/quiz/questionFourRandomiser";
import { ScoreProvider } from "@/components/quiz/scoreContext";

export default function Home() {
  return (
    <main className="pt-5">
      <div className="max-w-4xl mx-auto px-5">
        <div>
          <ScoreProvider>
            <CounterNav />
            <div className="mt-10">
              <QuestionRandomizer />
            </div>
          </ScoreProvider>
        </div>
      </div>
    </main>
  );
}
