// Component render tests. ≥8 tests covering each exported component.
// Uses @testing-library/react with happy-dom (vitest environment: node
// by default; happy-dom configured per-file via the doc block below).

// @vitest-environment happy-dom

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoCard } from "@components/memo-card";
import { MemoEditor } from "@components/memo-editor";
import { TagPreview } from "@components/tag-preview";
import { SearchInput } from "@components/search-input";
import { SearchResults } from "@components/search-results";
import { Header } from "@components/header";
import { SignInButton } from "@components/sign-in-button";
import { makeTag } from "@domain/tag";

describe("MemoCard", () => {
  it("renders title, body, and tags", () => {
    render(<MemoCard id="x" title="Hello" body="World" tags={[makeTag("work")]} />);
    expect(screen.getByText("Hello")).toBeTruthy();
    expect(screen.getByText("World")).toBeTruthy();
    expect(screen.getByText("work")).toBeTruthy();
  });
});

describe("MemoEditor", () => {
  it("renders inputs and submits", async () => {
    let captured: { title: string; body: string } | null = null;
    render(
      <MemoEditor
        onSubmit={async (d) => {
          captured = d;
        }}
      />
    );
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Hi" } });
    fireEvent.change(screen.getByLabelText("Body"), { target: { value: "There" } });
    fireEvent.click(screen.getByText("Save"));
    // Wait a tick for the async handler.
    await new Promise((r) => setTimeout(r, 0));
    expect(captured).toEqual({ title: "Hi", body: "There" });
  });
});

describe("TagPreview", () => {
  it("shows fallback when no tags", () => {
    render(<TagPreview tags={[]} />);
    expect(screen.getByText("No tags yet.")).toBeTruthy();
  });
  it("renders all tag values", () => {
    render(<TagPreview tags={[makeTag("work"), makeTag("learning")]} />);
    expect(screen.getByText("work")).toBeTruthy();
    expect(screen.getByText("learning")).toBeTruthy();
  });
});

describe("SearchInput", () => {
  it("calls onSearch with the entered query", () => {
    let captured = "";
    render(<SearchInput onSearch={(q) => { captured = q; }} />);
    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "react" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(captured).toBe("react");
  });
});

describe("SearchResults", () => {
  it("shows count + links for results", () => {
    render(<SearchResults query="react" results={[{ id: "1", title: "A" }]} />);
    expect(screen.getByText(/1 result for/)).toBeTruthy();
  });
  it("shows empty-state when no results", () => {
    render(<SearchResults query="x" results={[]} />);
    expect(screen.getByText(/No results for/)).toBeTruthy();
  });
});

describe("Header", () => {
  it("renders nav links", () => {
    render(<Header />);
    expect(screen.getByText("01-ai-memo")).toBeTruthy();
    expect(screen.getByText("Memos")).toBeTruthy();
    expect(screen.getByText("Search")).toBeTruthy();
  });
  it("shows user label when signed in", () => {
    render(<Header signedIn userLabel="alice" />);
    expect(screen.getByText("alice")).toBeTruthy();
  });
});

describe("SignInButton", () => {
  it("renders with default provider", () => {
    render(<SignInButton />);
    expect(screen.getByText("Sign in with github")).toBeTruthy();
  });
  it("renders with email provider", () => {
    render(<SignInButton provider="email" />);
    expect(screen.getByText("Sign in with email")).toBeTruthy();
  });
});
