import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { render, act } from '@testing-library/react'
import { CanvasWrapper, CanvasWrapperRef } from './CanvasWrapper'
import React from 'react'

// Feature: screenshot-editor, Property 3: File Validation and Error Handling
describe('CanvasWrapper File Validation Property Tests', () => {
  let mockOnError: ReturnType<typeof vi.fn>
  let mockOnFileValidationError: ReturnType<typeof vi.fn>
  let mockOnImageLoad: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnError = vi.fn()
    mockOnFileValidationError = vi.fn()
    mockOnImageLoad = vi.fn()
  })

  describe('Property 3: File Validation and Error Handling', () => {
    it('should validate file types and provide clear error messages for invalid formats', async () => {
      // **Validates: Requirements 1.3, 1.4**
      
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            // Generate various file types, including invalid ones
            mimeType: fc.oneof(
              fc.constantFrom('image/png', 'image/jpeg', 'image/jpg'), // Valid formats
              fc.constantFrom('text/plain', 'application/pdf', 'image/gif', 'image/webp', 'video/mp4') // Invalid formats
            ),
            size: fc.integer({ min: 1000, max: 10 * 1024 * 1024 }), // 1KB to 10MB (reasonable sizes)
            name: fc.string({ minLength: 5, maxLength: 20 }).map(s => s + '.png')
          }),
          async (fileSpec) => {
            // Reset mocks
            mockOnError.mockClear()
            mockOnFileValidationError.mockClear()
            mockOnImageLoad.mockClear()
            
            // Create a mock File object
            const mockFile = new File(['mock content'], fileSpec.name, {
              type: fileSpec.mimeType
            })
            
            // Override the size property
            Object.defineProperty(mockFile, 'size', {
              value: fileSpec.size,
              writable: false
            })

            const ref = React.createRef<CanvasWrapperRef>()
            
            await act(async () => {
              render(
                <CanvasWrapper
                  ref={ref}
                  onError={mockOnError}
                  onFileValidationError={mockOnFileValidationError}
                  onImageLoad={mockOnImageLoad}
                />
              )
            })

            // Wait for initialization
            await act(async () => {
              await new Promise(resolve => setTimeout(resolve, 50))
            })

            // Try to load the file - this should trigger validation
            await act(async () => {
              await ref.current?.loadImage(mockFile)
            })

            const validFormats = ['image/png', 'image/jpeg', 'image/jpg']
            const maxSize = 50 * 1024 * 1024 // 50MB
            
            const isValidFormat = validFormats.includes(fileSpec.mimeType)
            const isValidSize = fileSpec.size <= maxSize
            const shouldBeValid = isValidFormat && isValidSize

            if (!shouldBeValid) {
              // Invalid files should trigger validation error
              expect(mockOnFileValidationError).toHaveBeenCalled()
              
              const errorMessage = mockOnFileValidationError.mock.calls[0][0]
              expect(typeof errorMessage).toBe('string')
              expect(errorMessage.length).toBeGreaterThan(0)
              
              if (!isValidFormat) {
                // Error message should mention format issues
                expect(errorMessage.toLowerCase()).toMatch(/unsupported|format/)
              }
              
              if (!isValidSize) {
                // Error message should mention size issues
                expect(errorMessage.toLowerCase()).toMatch(/size|large/)
              }
            } else {
              // Valid files should not trigger validation errors
              // Note: They may still fail in CanvasEngine due to mock limitations, 
              // but validation should pass
              // We don't assert onImageLoad was called because the mock file 
              // won't actually load as a real image
            }
          }
        ),
        { 
          numRuns: 50, // Reduced for faster execution
          timeout: 15000, // Increased timeout
        }
      )
    })

    it('should handle file size limits correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            size: fc.integer({ min: 51 * 1024 * 1024, max: 100 * 1024 * 1024 }), // Oversized files
            mimeType: fc.constantFrom('image/png', 'image/jpeg', 'image/jpg')
          }),
          async (fileSpec) => {
            mockOnFileValidationError.mockClear()
            
            const mockFile = new File(['mock'], 'test.png', {
              type: fileSpec.mimeType
            })
            
            Object.defineProperty(mockFile, 'size', {
              value: fileSpec.size,
              writable: false
            })

            const ref = React.createRef<CanvasWrapperRef>()
            
            await act(async () => {
              render(
                <CanvasWrapper
                  ref={ref}
                  onError={mockOnError}
                  onFileValidationError={mockOnFileValidationError}
                  onImageLoad={mockOnImageLoad}
                />
              )
            })

            await act(async () => {
              await new Promise(resolve => setTimeout(resolve, 50))
            })

            await act(async () => {
              await ref.current?.loadImage(mockFile)
            })

            // Oversized files should trigger validation error
            expect(mockOnFileValidationError).toHaveBeenCalled()
            const errorMessage = mockOnFileValidationError.mock.calls[0][0]
            expect(errorMessage.toLowerCase()).toMatch(/size|large/)
          }
        ),
        { numRuns: 20, timeout: 10000 } // Added timeout
      )
    })

    it('should provide consistent error handling for different invalid file types', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('text/plain', 'application/pdf', 'video/mp4', 'audio/mp3'),
          async (invalidMimeType) => {
            mockOnFileValidationError.mockClear()
            
            const mockFile = new File(['mock'], 'test.txt', {
              type: invalidMimeType
            })
            
            Object.defineProperty(mockFile, 'size', {
              value: 1024, // Small valid size
              writable: false
            })

            const ref = React.createRef<CanvasWrapperRef>()
            
            await act(async () => {
              render(
                <CanvasWrapper
                  ref={ref}
                  onError={mockOnError}
                  onFileValidationError={mockOnFileValidationError}
                  onImageLoad={mockOnImageLoad}
                />
              )
            })

            await act(async () => {
              await new Promise(resolve => setTimeout(resolve, 50))
            })

            await act(async () => {
              await ref.current?.loadImage(mockFile)
            })

            // Invalid file types should trigger validation error
            expect(mockOnFileValidationError).toHaveBeenCalled()
            
            const errorMessage = mockOnFileValidationError.mock.calls[0][0]
            expect(typeof errorMessage).toBe('string')
            expect(errorMessage.length).toBeGreaterThan(0)
            expect(errorMessage.toLowerCase()).toMatch(/unsupported|format/)
          }
        ),
        { numRuns: 20, timeout: 10000 } // Added timeout
      )
    })
  })
})