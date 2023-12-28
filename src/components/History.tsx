"use client";
import { useContext } from "react";
import { StateContext } from "@/app/context/StateContext";
import { Note } from "@/lib/music_theory";
import { MessageType } from "@/app/context/messages";

export default function History() {
  const { state } = useContext(StateContext)!;

  return (
    <>
      <h1>History</h1>
      <p>{state.history.map((note, i) => (
        <span key={i}>
          ({note.name}, {note.length})
        </span>
      ))}</p>
    </>
  )
}