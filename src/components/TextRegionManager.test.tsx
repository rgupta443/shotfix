import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { TextRegionManager } from './TextRegionManager';
import { TextRegion } from '../lib/types/canvas';

// Feature: screenshot-editor, Property 6: Interactive Feedback Consistency
// **Validates: Requirements 2.5, 10.2, 10.4**

describe('TextRegionManager Property Tests', () => {
  // Generator for valid text regions
  const textRegionArbitrary = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    bounds: fc.record({
      x: fc.integer({ min: 0, max: 500 }),
      y: fc.integer({ min: 0, max: 500 }),
      width: fc.integer({ min: 10, max: 200 }),
      height: fc.integer({ min: 10, max: 50 })
    }),
    originalText: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    fontStyle: fc.record({
      family: fc.constantFrom('Arial', 'Helvetica', 'Times New Roman'),
      size: fc.integer({ min: 10, max: 24 }),
      weight: fc.constantFrom('normal', 'bold'),
      color: fc.constantFrom('#000000', '#333333', '#666666')
    }),
    confidence: fc.integer({ min: 30, max: 100 })
  }).map(data => ({
    ...data,
    editedText: undefined
  } as TextRegion));

  describe('Property 6: Interactive Feedback Consistency', () => {
    it('should provide immediate visual feedback for any interactive element', async () => {
      // Property: For any interactive element, hovering or interacting should provide immediate visual feedback
      await fc.assert(
        fc.asyncProperty(
          fc.array(textRegionArbitrary, { minLength: 1, maxLength: 5 }),
          async (textRegions) => {
            const mockOnUpdate = vi.fn();
            
            const { container } = render(
              <TextRegionManager
                textRegions={textRegions}
                onTextRegionUpdate={mockOnUpdate}
                isEnabled={true}
              />
            );

            // Property: Each text region should be rendered as an interactive element
            const overlayElements = container.querySelectorAll('[title*="Text:"]');
            expect(overlayElements.length).toBe(textRegions.length);

            // Property: Hovering should provide immediate visual feedback
            for (let i = 0; i < overlayElements.length; i++) {
              const element = overlayElements[i] as HTMLElement;
              
              // Test hover feedback
              fireEvent.mouseEnter(element);
              
              // Property: Should show visual indicators on hover
              await waitFor(() => {
                const hoveredElement = container.querySelector('.bg-blue-500\\/20');
                expect(hoveredElement).toBeTruthy();
              }, { timeout: 100 });

              // Property: Should show tooltip with text content
              const tooltip = container.querySelector('[class*="bg-gray-900"]');
              expect(tooltip).toBeTruthy();
              
              // Property: Tooltip should contain the original text
              if (tooltip) {
                const tooltipText = tooltip.textContent || '';
                const originalText = textRegions[i].originalText;
                const truncatedText = originalText.length > 20 
                  ? originalText.substring(0, 20) 
                  : originalText;
                expect(tooltipText).toContain(truncatedText);
              }

              fireEvent.mouseLeave(element);
              
              // Property: Visual feedback should be removed when not hovering
              await waitFor(() => {
                const hoveredElement = container.querySelector('.bg-blue-500\\/20');
                expect(hoveredElement).toBeFalsy();
              }, { timeout: 100 });
            }
          }
        ),
        { numRuns: 5, timeout: 5000 }
      );
    }, 30000);

    it('should provide contextual hints and affordances for any user interaction', async () => {
      // Property: Interactive elements should show contextual hints and affordances
      await fc.assert(
        fc.asyncProperty(
          fc.array(textRegionArbitrary, { minLength: 1, maxLength: 3 }),
          fc.record({
            scale: fc.float({ min: 0.5, max: 2.0 }),
            offsetX: fc.integer({ min: -50, max: 50 }),
            offsetY: fc.integer({ min: -50, max: 50 })
          }),
          async (textRegions, viewConfig) => {
            const mockOnUpdate = vi.fn();
            
            const { container, unmount } = render(
              <TextRegionManager
                textRegions={textRegions}
                onTextRegionUpdate={mockOnUpdate}
                scale={viewConfig.scale}
                offset={{ x: viewConfig.offsetX, y: viewConfig.offsetY }}
                isEnabled={true}
              />
            );

            // Property: Should show instructions when no regions are hovered
            const instructionsElements = container.querySelectorAll('[class*="text-blue-700"]');
            expect(instructionsElements.length).toBeGreaterThan(0);

            // Property: Instructions should indicate the number of detected regions
            const firstInstruction = instructionsElements[0];
            if (firstInstruction) {
              const instructionText = firstInstruction.textContent || '';
              expect(instructionText).toContain(textRegions.length.toString());
            }

            // Property: Each region should have a descriptive title attribute
            const interactiveElements = container.querySelectorAll('[title*="Text:"]');
            expect(interactiveElements.length).toBe(textRegions.length);
            
            interactiveElements.forEach((element, index) => {
              const title = element.getAttribute('title') || '';
              expect(title).toContain('Text:');
              expect(title).toContain(textRegions[index].originalText);
              expect(title).toContain('confidence');
            });

            unmount();
          }
        ),
        { numRuns: 5, timeout: 3000 }
      );
    }, 20000);

    it('should handle click interactions consistently across all text regions', async () => {
      // Property: Clicking any text region should trigger edit mode consistently
      await fc.assert(
        fc.asyncProperty(
          fc.array(textRegionArbitrary, { minLength: 1, maxLength: 4 }),
          async (textRegions) => {
            const mockOnUpdate = vi.fn();
            
            const { container } = render(
              <TextRegionManager
                textRegions={textRegions}
                onTextRegionUpdate={mockOnUpdate}
                isEnabled={true}
              />
            );

            const interactiveElements = container.querySelectorAll('[title*="Text:"]');
            
            // Property: Each text region should be clickable
            for (let i = 0; i < interactiveElements.length; i++) {
              const element = interactiveElements[i] as HTMLElement;
              
              fireEvent.click(element);
              
              // Property: Clicking should open an inline editor
              await waitFor(() => {
                const editor = container.querySelector('input, textarea');
                expect(editor).toBeTruthy();
              }, { timeout: 200 });

              // Property: Editor should contain the original text
              const editor = container.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
              if (editor) {
                expect(editor.value).toBe(textRegions[i].originalText);
              }

              // Property: Should have save and cancel buttons
              const saveButton = screen.queryByText('Save');
              const cancelButton = screen.queryByText('Cancel');
              expect(saveButton).toBeTruthy();
              expect(cancelButton).toBeTruthy();

              // Cancel to close editor for next iteration
              if (cancelButton) {
                fireEvent.click(cancelButton);
                await waitFor(() => {
                  const editor = container.querySelector('input, textarea');
                  expect(editor).toBeFalsy();
                }, { timeout: 200 });
              }
            }
          }
        ),
        { numRuns: 3, timeout: 5000 }
      );
    }, 30000);

    it('should maintain consistent visual feedback across different scales and offsets', async () => {
      // Property: Visual feedback should work consistently regardless of scale and offset
      await fc.assert(
        fc.asyncProperty(
          textRegionArbitrary,
          fc.record({
            scale: fc.float({ min: 0.5, max: 2.0 }), // Reduced range for stability
            offsetX: fc.integer({ min: -50, max: 50 }),
            offsetY: fc.integer({ min: -50, max: 50 })
          }),
          async (textRegion, transform) => {
            const mockOnUpdate = vi.fn();
            
            const { container, unmount } = render(
              <TextRegionManager
                textRegions={[textRegion]}
                onTextRegionUpdate={mockOnUpdate}
                scale={transform.scale}
                offset={{ x: transform.offsetX, y: transform.offsetY }}
                isEnabled={true}
              />
            );

            const interactiveElement = container.querySelector('[title*="Text:"]') as HTMLElement;
            expect(interactiveElement).toBeTruthy();

            // Property: Element should have absolute positioning
            if (interactiveElement) {
              // Check if element has positioning styles applied (either inline or computed)
              const hasPositioning = interactiveElement.style.position === 'absolute' || 
                                   interactiveElement.classList.contains('absolute') ||
                                   interactiveElement.style.left !== '' ||
                                   interactiveElement.style.top !== '';
              expect(hasPositioning).toBe(true);

              // Property: Hover feedback should work regardless of transform
              fireEvent.mouseEnter(interactiveElement);
              
              await waitFor(() => {
                const hoveredElement = container.querySelector('.bg-blue-500\\/20');
                expect(hoveredElement).toBeTruthy();
              }, { timeout: 200 });

              // Property: Click should work regardless of transform
              fireEvent.click(interactiveElement);
              
              await waitFor(() => {
                const editor = container.querySelector('input, textarea');
                expect(editor).toBeTruthy();
              }, { timeout: 200 });
            }

            unmount();
          }
        ),
        { numRuns: 3, timeout: 3000 } // Reduced runs for stability
      );
    }, 15000);
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty or invalid text regions gracefully', async () => {
      // Property: Component should handle edge cases without crashing
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant([] as TextRegion[]),
            fc.array(textRegionArbitrary, { maxLength: 0 })
          ),
          async (textRegions) => {
            const mockOnUpdate = vi.fn();
            
            expect(() => {
              render(
                <TextRegionManager
                  textRegions={textRegions}
                  onTextRegionUpdate={mockOnUpdate}
                  isEnabled={true}
                />
              );
            }).not.toThrow();
          }
        ),
        { numRuns: 3 }
      );
    });

    it('should respect the isEnabled prop consistently', async () => {
      // Property: When disabled, no interactive feedback should be provided
      await fc.assert(
        fc.asyncProperty(
          fc.array(textRegionArbitrary, { minLength: 1, maxLength: 3 }),
          async (textRegions) => {
            const mockOnUpdate = vi.fn();
            
            const { container } = render(
              <TextRegionManager
                textRegions={textRegions}
                onTextRegionUpdate={mockOnUpdate}
                isEnabled={false}
              />
            );

            // Property: Should not render any interactive elements when disabled
            const interactiveElements = container.querySelectorAll('[title*="Text:"]');
            expect(interactiveElements.length).toBe(0);

            // Property: Should not show instructions when disabled
            const instructions = screen.queryByText(/text region.*detected/i);
            expect(instructions).toBeFalsy();
          }
        ),
        { numRuns: 3 }
      );
    });
  });
});