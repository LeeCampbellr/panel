import styles from "./drawer.module.css";

export function Drawer({
  isOpen,
  children,
  animationDirection = "left",
}: {
  isOpen: boolean;
  children?: React.ReactNode;
  animationDirection?: "left" | "right" | "top" | "bottom";
}) {
  return (
    <div
      className={styles.Drawer}
      data-direction={animationDirection}
      data-open={isOpen}
    >
      <div className={styles.DrawerContent}>
        <h1>Drawer</h1>
        {children}
      </div>
    </div>
  );
}
