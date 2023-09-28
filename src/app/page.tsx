"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";

async function getEpsData(epsNo: string) {
  const response = await fetch(`/api/eps?epsNo=${epsNo}`);
  const json = await response.json();
  return json;
}

export default function Home() {
  const [epsNo, setEpsNo] = useState("");
  const [progress, setProgress] = useState(13)
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEpsNo(event.target.value);
  };
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["searchEps"],
    enabled: false,
    refetchOnWindowFocus: false,
    queryFn: () => getEpsData(epsNo)
  })
  useEffect(() => {
    if (isFetching) {
      const timer = setTimeout(() => setProgress(prev => Math.max(prev * 1.2, 100)), 500)
      return () => clearTimeout(timer)
    }
  }, [isFetching]);
  

  console.log(data);
  return (
    <main>
      <div className="flex min-h-screen flex-col gap-3 items-center p-24">
        {isFetching ? <Progress value={progress} className="md:w-[60%]" /> : <>
          <Label htmlFor="epsNo" className="md:text-xl">EPS Topik Exams Number</Label>
          <Input onChange={handleInputChange} id="epsNo" value={epsNo} placeholder="e.g 0122022C + Your Exams Number" />
          <Button variant={"outline"} onClick={() => refetch()}>Search</Button>
        </>}
      </div>
    </main>
  )
}
