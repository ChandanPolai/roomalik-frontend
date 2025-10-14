# Logger Service

A comprehensive logging system for the Roomalik Frontend application using `react-native-logs`.

## Features

- **Color-coded logs** with different levels (DEBUG, INFO, WARN, ERROR)
- **Module-specific loggers** for different parts of the app
- **Performance tracking** with timing information
- **Structured logging** with metadata support
- **Development/Production modes** (shows all logs in dev, only errors in production)

## Usage

### Basic Logging

```typescript
import logger from '../services/logger/logger.service';

// Basic logging methods
logger.debug('Debug information', { data: 'some data' });
logger.info('General information', { userId: 123 });
logger.warn('Warning message', { issue: 'potential problem' });
logger.error('Error occurred', error, 'ComponentName');
```

### Specialized Logging

```typescript
// API logging
logger.apiRequest('POST', '/auth/login', { email: 'user@example.com' });
logger.apiResponse(200, '/auth/login', { token: 'abc123' }, 150);
logger.apiError(error, '/auth/login', 'POST');

// Authentication logging
logger.authAction('Login attempt', { email: 'user@example.com' });
logger.authError(error, 'Login');

// Storage logging
logger.storageAction('Set item', 'user_token', 'abc123');
logger.storageError(error, 'Set Item', 'user_token');

// UI logging
logger.uiAction('Button pressed', 'LoginScreen', { buttonType: 'submit' });
logger.uiError(error, 'LoginScreen', 'Form Submission');

// Navigation logging
logger.navigationAction('Navigate to profile', '/profile', { userId: 123 });
logger.navigationError(error, 'Navigate', '/profile');

// Performance logging
logger.performance('API call', 250, { endpoint: '/users' });

// User action logging
logger.userAction('Login button pressed', { email: 'user@example.com' });

// Network status logging
logger.networkStatus('Connected', { type: 'wifi' });
```

### Module-Specific Loggers

```typescript
import { apiLogger, authLogger, storageLogger, uiLogger, navigationLogger } from '../services/logger/logger.service';

// Use specific loggers for different modules
apiLogger.info('API request completed');
authLogger.warn('Token about to expire');
storageLogger.debug('Cache updated');
uiLogger.error('Component render failed');
navigationLogger.info('Route changed');
```

## Log Levels

- **DEBUG (0)**: Detailed debugging information
- **INFO (1)**: General information about app flow
- **WARN (2)**: Warning messages for potential issues
- **ERROR (3)**: Error messages and exceptions

## Configuration

The logger is configured in `logger.service.ts` with:

- **Development mode**: Shows all log levels
- **Production mode**: Shows only ERROR level logs
- **Custom transport**: Color-coded console output with timestamps
- **Structured data**: JSON formatting for complex objects

## Examples in Components

```typescript
// In a React component
import logger from '../services/logger/logger.service';

const MyComponent = () => {
  const handleButtonPress = () => {
    logger.userAction('Button pressed', { component: 'MyComponent' });
    
    try {
      // Some operation
      logger.uiAction('Operation started', 'MyComponent');
    } catch (error) {
      logger.uiError(error, 'MyComponent', 'Button Press');
    }
  };

  return (
    <TouchableOpacity onPress={handleButtonPress}>
      <Text>Press Me</Text>
    </TouchableOpacity>
  );
};
```

## Best Practices

1. **Use appropriate log levels**: DEBUG for detailed info, INFO for general flow, WARN for issues, ERROR for exceptions
2. **Include context**: Always provide relevant data and module names
3. **Don't log sensitive data**: Avoid logging passwords, tokens, or personal information
4. **Use specialized methods**: Use `apiRequest`, `authAction`, etc. for better categorization
5. **Performance logging**: Use `performance()` method to track slow operations

## Output Format

The logger outputs formatted messages like:

```
[2024-01-15T10:30:45.123Z] INFO: 📤 POST /auth/login
Data: {
  "method": "POST",
  "url": "/auth/login",
  "data": {
    "email": "user@example.com"
  }
}
```

This provides clear, structured logging that's easy to read and debug during development.
