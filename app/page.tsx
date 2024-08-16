import CounterNav from "@/components/nav/counterNav";
import QuestionRandomizer from "@/components/quiz/questionFourRandomiser";

export default function Home() {
  return (
    <main className="pt-5">
      <div className="max-w-4xl mx-auto px-5">
        <div>
          <CounterNav />
          <div className="mt-10">
            <QuestionRandomizer />
          </div>
        </div>
      </div>
    </main>
  );
}
