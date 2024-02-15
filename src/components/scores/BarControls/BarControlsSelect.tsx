import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues, UseControllerProps } from "react-hook-form";

type SelectProps<T extends FieldValues> = {
  name: "clef" | "key" | "beatCount" | "beatValue";
  children: React.ReactNode;
} & UseControllerProps<T>;

export function BarControlsSelect<T extends FieldValues>({
  control,
  name,
  children,
}: SelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="col-span-2 h-8">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{children}</SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
