import { ReactNode } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({ label, htmlFor, error, required, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {children}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
