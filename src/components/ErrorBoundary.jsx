import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    // prindem erorile ca sa nu crape tot OS-ul direct
    this.setState({ error, info });
    // TODO: log la vreun serviciu extern
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
