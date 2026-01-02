import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { CanvasEngine } from './CanvasEngine'

// Feature: screenshot-editor, Property 1: Image Loading Performance
describe('CanvasEngine Property Tests', () => {
  let canvasEngine: CanvasEngine
  let mockContainer: HTMLDivElement

  beforeEach(() => {
    canvasEngine = new CanvasEngine()
    mockContainer = document.createElement('div')
    mockContainer.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
    })
    document.body.appendChild(mockContainer)
    canvasEngine.initialize(mockContainer)
  })

  describe('Property 1: Image Loading Performance', () => {
    it('should load and display any valid image within 2 seconds', async () => {
      // **Validates: Requirements 1.1, 9.1**
      
      await fc.assert(
        fc.asyncProperty(
          // Generate various image dimensions
          fc.record({
            width: fc.integer({ min: 10, max: 2000 }),
            height: fc.integer({ min: 10, max: 2000 }),
            format: fc.constantFrom('png', 'jpg', 'jpeg'),
          }),
          async (imageSpec) => {
            // Create a proper HTMLImageElement mock
            const mockImage = document.createElement('img') as HTMLImageElement
            
            // Set up the image properties
            Object.defineProperty(mockImage, 'naturalWidth', {
              value: imageSpec.width,
              writable: false
            })
            Object.defineProperty(mockImage, 'naturalHeight', {
              value: imageSpec.height,
              writable: false
            })
            
            // Mock the image as loaded
            Object.defineProperty(mockImage, 'complete', {
              value: true,
              writable: false
            })
            
            // Measure loading time
            const startTime = performance.now()
            
            try {
              await canvasEngine.loadImage(mockImage)
              const loadTime = performance.now() - startTime
              
              // Verify performance requirement: should complete within 2 seconds (2000ms)
              expect(loadTime).toBeLessThan(2000)
              
              // Verify image is loaded in canvas state
              const state = canvasEngine.getState()
              expect(state.image.data).toBe(mockImage)
              expect(state.image.dimensions.width).toBe(imageSpec.width)
              expect(state.image.dimensions.height).toBe(imageSpec.height)
              
              // Verify performance metrics are recorded
              const metrics = canvasEngine.getPerformanceMetrics()
              expect(metrics.imageLoadTime).toBeGreaterThan(0)
              expect(metrics.imageLoadTime).toBeLessThan(2000)
              
            } catch (error) {
              // Should not throw errors for valid images
              throw new Error(`Image loading failed unexpectedly: ${error}`)
            }
          }
        ),
        { 
          numRuns: 100, // Minimum 100 iterations as specified in design
          timeout: 5000, // Allow extra time for test execution
        }
      )
    })

    it('should handle various file sizes efficiently', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            width: fc.integer({ min: 50, max: 1920 }),
            height: fc.integer({ min: 50, max: 1080 }),
          }),
          async (dimensions) => {
            const mockImage = document.createElement('img') as HTMLImageElement
            
            Object.defineProperty(mockImage, 'naturalWidth', {
              value: dimensions.width,
              writable: false
            })
            Object.defineProperty(mockImage, 'naturalHeight', {
              value: dimensions.height,
              writable: false
            })
            Object.defineProperty(mockImage, 'complete', {
              value: true,
              writable: false
            })
            
            const startTime = performance.now()
            await canvasEngine.loadImage(mockImage)
            const loadTime = performance.now() - startTime
            
            // Performance should be consistent regardless of reasonable image sizes
            expect(loadTime).toBeLessThan(2000)
            
            // Verify estimated size calculation
            const state = canvasEngine.getState()
            const expectedSize = dimensions.width * dimensions.height * 4 // RGBA
            expect(state.image.originalSize).toBe(expectedSize)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain canvas state consistency after image loading', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            width: fc.integer({ min: 100, max: 800 }),
            height: fc.integer({ min: 100, max: 600 }),
          }),
          async (dimensions) => {
            const mockImage = document.createElement('img') as HTMLImageElement
            
            Object.defineProperty(mockImage, 'naturalWidth', {
              value: dimensions.width,
              writable: false
            })
            Object.defineProperty(mockImage, 'naturalHeight', {
              value: dimensions.height,
              writable: false
            })
            Object.defineProperty(mockImage, 'complete', {
              value: true,
              writable: false
            })
            
            // Load image
            await canvasEngine.loadImage(mockImage)
            
            // Verify state consistency
            const state = canvasEngine.getState()
            
            // Image data should be set
            expect(state.image.data).toBe(mockImage)
            
            // Dimensions should match
            expect(state.image.dimensions.width).toBe(dimensions.width)
            expect(state.image.dimensions.height).toBe(dimensions.height)
            
            // UI state should be initialized properly
            expect(state.ui.zoomLevel).toBeGreaterThan(0)
            expect(state.ui.panOffset).toBeDefined()
            expect(state.ui.snapGuidesEnabled).toBe(true)
            
            // Layers should be initialized empty
            expect(state.layers.textRegions).toEqual([])
            expect(state.layers.shapes).toEqual([])
            expect(state.layers.blurRegions).toEqual([])
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Canvas State Management', () => {
    it('should maintain zoom and pan state correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            imageWidth: fc.integer({ min: 200, max: 1000 }),
            imageHeight: fc.integer({ min: 200, max: 1000 }),
          }),
          async (spec) => {
            const mockImage = document.createElement('img') as HTMLImageElement
            
            Object.defineProperty(mockImage, 'naturalWidth', {
              value: spec.imageWidth,
              writable: false
            })
            Object.defineProperty(mockImage, 'naturalHeight', {
              value: spec.imageHeight,
              writable: false
            })
            Object.defineProperty(mockImage, 'complete', {
              value: true,
              writable: false
            })
            
            await canvasEngine.loadImage(mockImage)
            
            const state = canvasEngine.getState()
            
            // Zoom level should be positive and reasonable
            expect(state.ui.zoomLevel).toBeGreaterThan(0)
            expect(state.ui.zoomLevel).toBeLessThanOrEqual(1) // Should not zoom beyond original size initially
            
            // Pan offset should be defined
            expect(typeof state.ui.panOffset.x).toBe('number')
            expect(typeof state.ui.panOffset.y).toBe('number')
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})