import LeftPanel from "@/src/components/left-panel";
import RightPanel from "@/src/components/right-panel";

export default function Home() {
  console.log("hiiii");
  return (
    <main className="m-5">
      <section className="flex overflow-y-hidden h-[calc(100vh-50px)] max-w-[1700px] mx-auto bg-left-panel">
        {/* Green background decorator for Light Mode */}
        <div className="fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30" />
        <LeftPanel />
        <RightPanel />
      </section>
    </main>
  );
}
