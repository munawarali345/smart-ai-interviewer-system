// ================================================================
// Global Error Boundary - Catches all unhandled errors in the app
// ================================================================
// Purpose: When app crashes unexpectedly, show user-friendly error UI
// instead of white screen. User can try again to reset the app.
// ================================================================

// 'use client' is required because this is a Client Component
'use client'

// ================================================================
// Main Function: GlobalError
// ================================================================
// Parameters:
// - error: The error object that caused the crash
//          Contains: message, stack trace, digest (error ID)
// - reset: Function to reset the app and try again
// ================================================================
export default function GlobalError({
    error,
    reset,
}: {
    // Error type: standard Error plus optional digest (error ID)
    error: Error & { digest?: string }
    // Reset function: tries to recover from the error
    reset: () => void
}) {
    // ================================================================
    // Return: JSX - Full page error UI
    // ================================================================
    return (
        // <html> and <body> required for full page error boundary
        <html>
            <body>
                {/* Center content on screen with gray background */}
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    
                    {/* White card with shadow */}
                    <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                        
                        {/* Error Title */}
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            ❌ Something went wrong!
                        </h2>
                        
                        {/* Error Description */}
                        <p className="text-gray-600 mb-6">
                            We&apos;re sorry, an unexpected error occurred. 
                            Please try again.
                        </p>

                        {/* ================================================================ */}
                        {/* Try Again Button - Calls reset() to recover from error */}
                        {/* ================================================================ */}
                        <button
                            onClick={() => reset()}
                            className="bg-blue-600 text-white px-6 py-2 rounded 
                                       hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>

                        {/* ================================================================ */}
                        {/* Optional: Show error digest for debugging (development only) */}
                        {/* ================================================================ */}
                       
                        {process.env.NODE_ENV === 'development' && error.digest && (
                            <p className="text-xs text-gray-400 mt-4">
                                Error ID: {error.digest}
                            </p>
                        )}
                        
                    </div>
                </div>
            </body>
        </html>
    )
}
