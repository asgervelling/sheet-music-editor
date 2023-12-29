// "use client";
// import { useEffect, useState } from "react";

// /**
//  * Indicator for whether the Ctrl key is held down.
//  */
// export default function CtrlKeyIndicator() {  
//   const [ctrlKeyHeld, setCtrlKeyHeld] = useState(false);

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Control") {
//         setCtrlKeyHeld(true);
//       }
//       if (event.key === "z" && ctrlKeyHeld) {
        
//       }
//     };

//     const handleKeyUp = (event: KeyboardEvent) => {
//       if (event.key === "Control") {
//         setCtrlKeyHeld(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, []);

//   const classNames = ctrlKeyHeld
//     ? "bg-[var(--color-primary)] text-white"
//     : "text-[var(--color-primary)]";
//   return (
//     <div
//       className={`p-2 select-none
//                  border border-[var(--color-primary)]
//                  ${classNames}`}
//     >
//       Ctrl
//     </div>
//   );
// }

