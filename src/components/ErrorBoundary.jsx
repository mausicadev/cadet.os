import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    // Save error info to state so we can render a helpful overlay
    this.setState({ error, info });
    // Also log to console for devtools
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      const containerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10,10,10,0.95)',
        color: '#ff9b6b',
        padding: '24px',
        zIndex: 99999,
        fontFamily: 'Courier New, monospace',
        overflow: 'auto'
      };

      return (
        <div style={containerStyle}>
          <h1 style={{ color: '#ff6b6b' }}>Application Error</h1>
          <div style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
            {String(this.state.error && this.state.error.toString())}
          </div>
          <details style={{ marginTop: 12, color: '#c9dff0' }}>
            {this.state.info && this.state.info.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
