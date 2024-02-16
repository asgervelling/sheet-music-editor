import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, UseControllerProps, useFormContext } from "react-hook-form";

type InputProps<T extends FieldValues> = {
  name: "clef" | "key" | "beatCount" | "beatValue";
} & UseControllerProps<T>;

export function BeatCountInput<T extends FieldValues>({
  name,
}: InputProps<T>) {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="h-8 col-span-2">
            <FormControl>
              <Input
                {...field}
                type="number"
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
    </>
  );
}
