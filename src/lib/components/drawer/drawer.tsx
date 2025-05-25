import styles from "./drawer.module.css";

export function Drawer({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.Drawer} data-open={isOpen}>
      <div className={styles.DrawerContent}>
        <h1>Drawer</h1>
        {children}
      </div>
    </div>
  );
}
