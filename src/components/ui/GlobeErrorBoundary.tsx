"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onExit?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Globe WebGL Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-mono p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="text-red-400 text-4xl mb-2">⚠</div>
            <h2 className="text-xl font-bold text-red-400">
              WebGL Rendering Failed
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your device doesn&apos;t support 3D rendering, or the WebGL
              context could not be initialized.
            </p>
            <p className="text-neutral-500 text-xs">
              {this.state.error?.message}
            </p>
            <button
              onClick={this.props.onExit}
              className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold rounded transition-colors"
            >
              ← Return to Terminal
            </button>
            <p className="text-neutral-600 text-xs mt-2">
              Type <span className="text-green-400">&apos;exit&apos;</span> to
              return.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobeErrorBoundary;
