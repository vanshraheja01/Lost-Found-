import styles from "./StatusBanner.module.css";

interface StatusBannerProps {
  variant: "success" | "error" | "info";
  children: React.ReactNode;
}

export default function StatusBanner({ variant, children }: StatusBannerProps) {
  return (
    <div className={`${styles.banner} ${styles[variant]}`} role={variant === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
