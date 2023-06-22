"use client";

import { CircularProgress } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "@/context/Context";

const CircleLoading = () => {
  const { state } = useContext(AppContext);
  const { loading } = state;

  return loading &&  (
     <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        cursor: "wait",
        pointerEvents: "fill",
        userSelect: "none",
      }}
    >
      <CircularProgress size={40} sx={{ color: "#c88806" }} />
    </div>

  )
};

export default CircleLoading;
