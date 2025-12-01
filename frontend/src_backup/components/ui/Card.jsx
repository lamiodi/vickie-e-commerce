import React from "react";
import styles from "../../styles/design.module.css";

export default function Card({ className = "", children }) {
  return (
    <div className={["border bg-white", styles.radius8, styles.shadowElevated, "p-3"].join(" ") + (className ? ` ${className}` : "")}>{children}</div>
  );
}