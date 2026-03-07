import type { Mantra, RenderLineInfo } from "@/types/mantra";

export function getFullText(mantra: Mantra): string {
  return mantra.map((s) => s.line).join("\n");
}

export function getLinesForRender(mantra: Mantra): RenderLineInfo[] {
  let index = 0;

  return mantra.map(({ line, indent }) => {
    const startIndex = index;
    index += line.length + 1;

    return {
      line,
      indent,
      startIndex,
      endIndex: startIndex + line.length,
    };
  });
}

export function getIndentPx(indent: number, charBoxWidth: number): number {
  return indent * charBoxWidth;
}
