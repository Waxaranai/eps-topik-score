"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/Dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/AlertDialog";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { EPSTopikResult } from "@/pages/api/eps";

async function getEpsData(epsNo: string): Promise<{ message: string; data?: EPSTopikResult }> {
  const response = await fetch(`/api/eps?epsNo=${epsNo}`);
  const json = await response.json();
  return json;
}

export default function Home() {
  const [epsNo, setEpsNo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(13);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEpsNo(event.target.value);
  };
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["searchEps"],
    enabled: false,
    refetchOnWindowFocus: false,
    queryFn: () => getEpsData(epsNo),
    onSuccess: () => setIsOpen(prev => !prev)
  })
  useEffect(() => {
    if (isFetching) {
      const timer = setTimeout(() => setProgress(prev => Math.max(prev * 1.2, 100)), 500)
      return () => clearTimeout(timer)
    }
  }, [isFetching]);

  return (
    <main>
      {data?.data ? <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[425px] md:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>EPS Topik Score</DialogTitle>
            <DialogDescription>
              {data?.data?.epsTopikNo}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <ol>
                <li className="flex flex-col gap-3">
                  <>
                    <h1 className="font-bold">Name</h1>
                    <p>{data.data.name}</p>
                  </>
                  <>
                    <h1 className="font-bold">Nationality</h1>
                    <p>{data.data.nationality}</p>
                  </>
                  <>
                    <h1 className="font-bold">Sector</h1>
                    <p>{data.data.sector}</p>
                  </>
                  <>
                    <h1 className="font-bold">Score</h1>
                    <div className="flex flex-row justify-between gap-4">
                      <>
                        <h1 className="font-bold">Total</h1>
                        <p>{data.data.point.total}</p>
                      </>
                      <>
                        <h1 className="font-bold">Reading</h1>
                        <p>{data.data.point.reading}</p>
                      </>
                      <>
                        <h1 className="font-bold">Listening</h1>
                        <p>{data.data.point.listening}</p>
                      </>
                    </div>
                  </>
                </li>
              </ol>
            </div>
          </div>
          <DialogFooter>
            Exam date {data?.data?.examDate}
          </DialogFooter>
        </DialogContent>
      </Dialog> :
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Attention!</AlertDialogTitle>
              <AlertDialogDescription>
                {data?.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>}

      <div className="flex min-h-screen flex-col gap-3 items-center p-20 md:p-24">
        {isFetching ? <Progress value={progress} className="md:w-[60%]" /> : <>
          <Label htmlFor="epsNo" className="md:text-xl">EPS Topik Exams Number</Label>
          <Input onChange={handleInputChange} id="epsNo" value={epsNo} placeholder="e.g 0122022C + Your Exams Number" />
          <Button variant={"outline"} onClick={() => refetch()}>Search</Button>
        </>}
      </div>
    </main>
  )
}
