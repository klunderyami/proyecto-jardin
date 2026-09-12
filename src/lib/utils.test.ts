import { describe, expect, it } from "vitest";
import { cn } from "./utils";
import { buildSmsLink, BUSINESS } from "./constants";

describe("cn", () => {
  it("combina clases y resuelve conflictos de Tailwind", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "text-lg", "text-neutral-600")).toBe(
      "text-sm text-neutral-600"
    );
    expect(cn("a", undefined, null)).toBe("a");
  });
});

describe("constants", () => {
  it("usa el teléfono del negocio por defecto", () => {
    expect(BUSINESS.phone).toBe("7373144215");
    expect(BUSINESS.email).toBe("nietogreencare@gmail.com");
  });

  it("construye el enlace SMS nativo prellenado", () => {
    expect(buildSmsLink()).toBe("sms:+17373144215");
    expect(buildSmsLink("Hola")).toBe(
      "sms:+17373144215?body=Hola"
    );
  });
});