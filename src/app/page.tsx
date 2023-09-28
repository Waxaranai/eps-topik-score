import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col gap-3 items-center p-24">
        <Label htmlFor="epsNo">EPS Topik Exams Number</Label>
        <Input id="epsNo" placeholder="e.g 0122022C + Your Exams Number" />
        <Button variant={"outline"}>Search</Button>
      </div>
    </main>
  )
}
