"use client";

import * as React from "react";
import { Lightbulb } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/types";

interface HintDrawerProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HintDrawer({
  question,
  open,
  onOpenChange
}: HintDrawerProps) {
  const [revealedCount, setRevealedCount] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setRevealedCount(0);
    }
  }, [open, question?.id]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{question?.title ?? "Hints"}</DrawerTitle>
          <DrawerDescription>
            Reveal hints progressively so you can stay challenged without jumping
            straight to the full approach.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4">
          {(question?.hints ?? []).map((hint, index) => {
            const visible = index < revealedCount;

            return (
              <Card key={`${question?.id ?? "question"}-${index}`}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <Lightbulb className="h-4 w-4 text-cyan-300" />
                      Hint {index + 1}
                    </div>
                    {!visible ? (
                      <Button
                        size="sm"
                        onClick={() => setRevealedCount(index + 1)}
                      >
                        Reveal Hint {index + 1}
                      </Button>
                    ) : null}
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
                    {visible
                      ? hint
                      : "Keep going. Reveal this hint only when you want the next nudge."}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
