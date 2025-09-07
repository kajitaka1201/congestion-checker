import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { describe, it, expect, mock, afterEach } from "bun:test";
import DraggableDesk from "./draggable-desk";
import { DeskType } from "@/types/firebase-type";

const mockDesk: DeskType & { id: string } = {
  x: 100,
  y: 200,
  orientation: "horizontal",
  used: false,
  id: "desk-1"
};

const mockProps = {
  desk: mockDesk,
  index: 0,
  selectedDeskId: null,
  setSelectedDeskId: mock(),
  width: 900
};

const renderWithDndContext = (component: React.ReactElement) => {
  return render(<DndContext>{component}</DndContext>);
};

describe("DraggableDesk", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders desk with correct text", () => {
    renderWithDndContext(<DraggableDesk {...mockProps} />);
    expect(screen.getByText("机 1")).toBeTruthy();
  });

  it("renders desk with correct index", () => {
    renderWithDndContext(<DraggableDesk {...mockProps} index={2} />);
    expect(screen.getByText("机 3")).toBeTruthy();
  });

  it("applies correct position styles", () => {
    renderWithDndContext(<DraggableDesk {...mockProps} />);
    const deskElement = screen.getByText("机 1").parentElement;
    expect((deskElement as HTMLElement).style.top).toBe("200%");
    expect((deskElement as HTMLElement).style.left).toBe("100%");
  });

  it("applies horizontal dimensions for rotation 0", () => {
    renderWithDndContext(<DraggableDesk {...mockProps} />);
    const deskElement = screen.getByText("机 1").parentElement;
    expect((deskElement as HTMLElement).style.width).toBe("70px");
    expect((deskElement as HTMLElement).style.height).toBe("50px");
  });

  it("applies vertical dimensions for rotation 90", () => {
    const rotatedDesk = { ...mockDesk, orientation: "vertical" as const };
    renderWithDndContext(<DraggableDesk {...mockProps} desk={rotatedDesk} />);
    const deskElement = screen.getByText("机 1").parentElement;
    expect((deskElement as HTMLElement).style.width).toBe("50px");
    expect((deskElement as HTMLElement).style.height).toBe("70px");
  });

  it("applies selection ring when selected", () => {
    renderWithDndContext(
      <DraggableDesk {...mockProps} selectedDeskId="desk-1" />
    );
    const deskElement = screen.getByText("机 1").parentElement;
    expect(deskElement?.className).toInclude("ring-4");
    expect(deskElement?.className).toInclude("ring-blue-500");
    expect(deskElement?.className).toInclude("ring-offset-2");
  });

  it("does not apply selection ring when not selected", () => {
    renderWithDndContext(
      <DraggableDesk {...mockProps} selectedDeskId="other-desk" />
    );
    const deskElement = screen.getByText("机 1").parentElement;
    expect(deskElement?.className).not.toInclude("ring-4");
  });

  it("calls setSelectedDeskId on mouse down", () => {
    const setSelectedDeskId = mock();
    renderWithDndContext(
      <DraggableDesk {...mockProps} setSelectedDeskId={setSelectedDeskId} />
    );
    const deskElement = screen.getByText("机 1").parentElement;

    fireEvent.mouseDown(deskElement!);
    expect(setSelectedDeskId).toHaveBeenCalledWith("desk-1");
  });

  it("applies cursor-move class for draggable behavior", () => {
    renderWithDndContext(<DraggableDesk {...mockProps} />);
    const deskElement = screen.getByText("机 1").parentElement;
    expect(deskElement?.className).toInclude("cursor-move");
  });

  it("applies touch-none class for touch interactions", () => {
    renderWithDndContext(<DraggableDesk {...mockProps} />);
    const deskElement = screen.getByText("机 1").parentElement;
    expect(deskElement?.className).toInclude("touch-none");
  });
});
