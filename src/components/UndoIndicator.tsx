"use client";
import { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Message } from "@/app/state/messages";
import CommandControls from "./CommandControls";

/**
 * An indicator and dispatcher for the undo command.
 */
export default function UndoIndicator() {
  const { dispatch } = useContext(StateContext)!;
  
  return (
    <CommandControls 
      keyCombination={["Control", "z"]}
      onPress={() => dispatch({ type: Message.UNDO })}
      commandName="Undo"
    />
  )
};