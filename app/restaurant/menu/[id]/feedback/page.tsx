import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export default function Feedback() {
  return (
    <div className="flex bg-white flex-col min-h-screen">
      <div className="bg-black p-4 text-3xl text-white text-center">
        Feedback
      </div>

      <div className="mt-10 text-center">
        <p>Please take a moment to tell us how we did.</p>
        <p>It would mean a lot to us.</p>
      </div>

      <Slider className="mt-4 p-4" defaultValue={[33]} max={100} step={1} />

      <div className="text-center text-2xl m-8 font-bold">
        What impacted your rating?
      </div>

      <div className="flex flex-col items-center gap-8">
        <Button className="rounded-full h-20 text-md w-60">FOOD QUALITY</Button>
        <Button className="rounded-full h-20 text-md w-60">AMBIENCE</Button>
        <Button className="rounded-full h-20 text-md w-60">SERVICE</Button>
        <Button className="rounded-full h-20 text-md w-60">PRICING</Button>
      </div>

      <div className="mt-auto p-4">
        <Textarea className="border-black w-full" placeholder="Type your message here." />
        <Button className="w-full mt-4">Send message</Button>
      </div>
    </div>
  );
}
