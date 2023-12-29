"use client";
import { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Message } from "@/app/state/messages";
import CommandControls from "./CommandControls";

/**
 * An indicator and dispatcher for the redo command.
 */
export default function RedoIndicator() {
  const { dispatch } = useContext(StateContext)!;

  return (
    <CommandControls
      keyCombination={["Control", "x"]}
      onPress={() => dispatch({ type: Message.REDO })}
      commandName="Redo"
    />
  );
}
