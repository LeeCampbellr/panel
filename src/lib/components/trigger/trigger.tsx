import styles from "./trigger.module.css";

export function Trigger({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <button
      className={styles.Trigger}
      data-panel-toggle
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? "Close" : "Open"} Panel
    </button>
  );
}
