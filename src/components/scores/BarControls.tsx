"use client";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Clef, Duration, NoteName, TimeSignature } from "@/app/music";
import ClefUnicode from "../icons/clefs/ClefUnicode";
import { pitches } from "@/app/music/notes";
import { asNumber } from "@/app/music/durations";

/**
 * A user interface for setting up a bar. \
 * That is, choosing a clef, a key signature
 * and a time signature.
 */
export default function BarControls() {
  const clefs: string[] = Object.keys(Clef);
  const isNumber = (s: string) => /^\d+$/.test(s);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const formSchema = z.object({
    clef: z.string().refine((c) => {
      return clefs.includes(capitalize(c));
    }),
    key: z.string().refine((k) => Object.keys(NoteName).includes(k)),
    beatCount: z.number().positive("Beat count must be a positive number"),
    beatValue: z.string().refine((d) => Object.values(Duration).includes(d as Duration))
  });

  const form = useForm<z.infer<typeof formSchema>>({
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
            <FormField
              control={form.control}
              name="clef"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-4">
                  <FormLabel>Clef</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-2">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Clef).map((c) => (
                        <SelectItem key={c} value={c}>
                          <div className="flex">
                            <ClefUnicode clef={c} />
                            <span className="pl-2 capitalize">{c}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-4">
                  <FormLabel>Key</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-2">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pitches.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Time signature</Label>
              <div className="col-span-2 grid grid-cols-5 items-center gap-2">
                <FormField
                  control={form.control}
                  name="beatCount"
                  render={({ field }) => (
                    <FormItem className="h-8 col-span-2">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="4"
                          className="w-full h-full
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="h-8 text-center">/</div>
                <FormField
                  control={form.control}
                  name="beatValue"
                  render={({ field }) => (
                    <FormItem className="col-span-2 h-8">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Duration).map((d) => (
                            <SelectItem key={d} value={d}>
                              {asNumber(d)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 items-center gap-4 pt-2">
              <div className="col-span-3" />
              <Button type="submit" className="col-span-2">
                OK
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
