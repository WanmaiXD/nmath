import MainNav from "@/components/nav/mainNav";
import QuestionRandomizer from "@/components/quiz/questionFourRandomiser";

export default function Home() {
  return (
    <main className="pt-5">
      <div className="max-w-4xl mx-auto px-5">
        <div>
          <MainNav />
          <div className="mt-10">
            <QuestionRandomizer />
          </div>
        </div>
      </div>
    </main>
  );
}
