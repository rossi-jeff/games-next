import { Yacht } from "../../../types/yacht.type";
import React from "react";

export default function YachtScoreRow({ yacht }: { yacht: Yacht }) {
  return (
    <div className="flex flex-wrap px-2 justify-between">
      <div>{yacht.id}</div>
      <div>{yacht.user ? yacht.user.UserName : "Anonymous"}</div>
      <div>{yacht.Total}</div>
    </div>
  );
}
