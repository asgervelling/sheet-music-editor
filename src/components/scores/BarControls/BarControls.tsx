"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormLabel } from "@/components/ui/form";
import { Button } from "../../ui/button";
import { Clef, Duration, NoteName } from "@/app/music";
import { BarControlsLine } from "./BarControlsLine";
import { BarControlsSelect } from "./BarControlsSelect";
import { ClefOptions } from "./ClefOptions";
import { KeyOptions } from "./KeyOptions";
import { BeatCountInput } from "./BeatCountInput";
import { BeatValueOptions } from "./BeatValueOptions";
import { SubmitLine } from "./SubmitLine";

type FormValues = {
  clef: string;
  key: string;
  beatCount: number;
  beatValue: string;
};

/**
 * A form for setting up a bar. \
 * That is, choosing a clef, a key signature
 * and a time signature.
 */
export default function BarControls() {
  const isValidClef = (s: string) =>
    Object.values(Clef)
      .map((c) => c.toLowerCase())
      .includes(s.toLowerCase());

  const isValidKey = (s: string) => Object.keys(NoteName).includes(s);

  const formSchema = z.object({
    clef: z.string().refine(isValidClef),
    key: z.string().refine(isValidKey),
    beatCount: z.coerce
      .number()
      .positive("Beat count must be a positive number"),
    beatValue: z
      .string()
      .refine((d) => Object.values(Duration).includes(d as Duration)),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clef: Clef.Treble,
      key: NoteName.C,
      beatCount: 4,
      beatValue: Duration.Quarter,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Bar</h4>
        <p className="text-sm text-muted-foreground">Edit this bar.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <BarControlsLine>
              <FormLabel>Clef</FormLabel>
              <BarControlsSelect control={form.control} name="clef">
                <ClefOptions />
              </BarControlsSelect>
            </BarControlsLine>

            <BarControlsLine>
              <FormLabel>Key</FormLabel>
              <BarControlsSelect control={form.control} name="key">
                <KeyOptions />
              </BarControlsSelect>
            </BarControlsLine>

            <BarControlsLine>
              <FormLabel>Time signature</FormLabel>
              <div className="col-span-2 grid grid-cols-5 items-center gap-2">
                <BeatCountInput control={form.control} name="beatCount" />
                <div className="h-8 text-center">/</div>
                <BarControlsSelect control={form.control} name="beatValue">
                  <BeatValueOptions />
                </BarControlsSelect>
              </div>
            </BarControlsLine>

            <SubmitLine>
              <Button type="submit">OK</Button>
            </SubmitLine>
          </div>
        </form>
      </Form>
    </div>
  );
}
