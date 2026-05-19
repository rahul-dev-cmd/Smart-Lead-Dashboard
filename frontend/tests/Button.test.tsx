import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../src/components/ui/Button";

describe("Button", () => {
  it("renders accessible button text", () => {
    render(<Button type="button">Save lead</Button>);

    expect(screen.getByRole("button", { name: "Save lead" }).textContent).toContain("Save lead");
  });
});
