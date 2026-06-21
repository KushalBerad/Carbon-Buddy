# Security Practices

Carbon Buddy follows secure full-stack development practices.

## Secret Management

- No hardcoded API keys inside repository
- Gemini API credentials stored using environment variables
- `.env.local` excluded using `.gitignore`
- `.env.example` provided for safe setup
- No API secrets exposed in frontend bundle

## API Security

- Gemini API requests proxied through Express backend
- Frontend never communicates directly with Gemini API
- Prompt sanitization implemented before API requests
- Input validation prevents malformed prompt abuse

## Dependency Security

- npm audit used for dependency vulnerability scanning
- Zero known vulnerabilities during submission

## Client Security

- Zustand localStorage persistence handled safely
- No sensitive user credentials stored locally
- No unsafe HTML rendering methods used
- No use of eval() or dangerous runtime execution

## Privacy Protection

- No bank account data collected
- No payment data collected
- No invasive user behavioral tracking

## Deployment Security

- Production environment separated from development environment
- Environment variables abstract external AI services