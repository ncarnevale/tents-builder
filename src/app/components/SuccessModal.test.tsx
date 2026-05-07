// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SuccessModal from "./SuccessModal";

afterEach(() => {
  cleanup();
});

describe("SuccessModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a Print action and invokes the print callback", async () => {
    const user = userEvent.setup();
    const print = vi.fn();
    render(
      <SuccessModal
        isOpen
        onClose={vi.fn()}
        link="/play/abc123"
        onPrint={print}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Print Puzzle" }));

    expect(print).toHaveBeenCalledTimes(1);
  });
});
