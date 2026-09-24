"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";

interface DropdownProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  placeholder: string;
  invalid?: boolean;
}

/** Custom animated listbox that replaces a native <select> (which browsers won't let us animate). */
export default function Dropdown({ id, value, onChange, onBlur, options, placeholder, invalid }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function close() {
    setOpen(false);
    onBlur?.();
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      const index = options.indexOf(value);
      setHighlighted(index >= 0 ? index : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function matchTypeahead(char: string) {
    if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    typeaheadRef.current += char.toLowerCase();
    typeaheadTimer.current = setTimeout(() => {
      typeaheadRef.current = "";
    }, 500);

    const anchor = open ? highlighted : options.indexOf(value);
    const order = options.map((_, i) => (anchor + 1 + i) % options.length);
    return order.find((i) => options[i].toLowerCase().startsWith(typeaheadRef.current));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) setOpen(true);
        else setHighlighted((h) => Math.min(h + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) setOpen(true);
        else setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setHighlighted(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setHighlighted(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) {
          const option = options[highlighted];
          if (option) onChange(option);
          close();
        } else {
          setOpen(true);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case "Tab":
        if (open) close();
        break;
      default:
        if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) {
          const match = matchTypeahead(event.key);
          if (match !== undefined) {
            if (open) setHighlighted(match);
            else onChange(options[match]);
          }
        }
    }
  }

  return (
    <div className={styles.dropdown} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        id={id}
        className={`${styles.trigger} ${invalid ? styles.triggerInvalid : ""}`}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
      >
        <span className={value ? styles.value : styles.placeholder}>{value || placeholder}</span>
        <svg className={styles.chevron} width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
          <path
            d="M1 1.5L7 7.5L13 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul id={`${id}-listbox`} role="listbox" aria-labelledby={id} className={styles.menu} data-open={open || undefined}>
        {options.map((option, index) => (
          <li
            key={option}
            id={`${id}-option-${index}`}
            role="option"
            aria-selected={option === value}
            className={[
              styles.option,
              index === highlighted ? styles.optionHighlighted : "",
              option === value ? styles.optionSelected : "",
            ]
              .join(" ")
              .trim()}
            style={{ "--i": index } as React.CSSProperties}
            onMouseEnter={() => setHighlighted(index)}
            onClick={() => {
              onChange(option);
              close();
              triggerRef.current?.focus();
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
