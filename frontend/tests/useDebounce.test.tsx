import { act, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "../src/hooks/useDebounce";

const DebounceHarness = () => {
  const [value, setValue] = useState("initial");
  const debounced = useDebounce(value, 300);

  return (
    <div>
      <button type="button" onClick={() => setValue("updated")}>
        Change
      </button>
      <span>{debounced}</span>
    </div>
  );
};

describe("useDebounce", () => {
  it("delays emitting the changed value", () => {
    vi.useFakeTimers();
    render(<DebounceHarness />);

    act(() => {
      screen.getByRole("button", { name: "Change" }).click();
    });
    expect(screen.getByText("initial")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("updated")).toBeTruthy();
    vi.useRealTimers();
  });
});
