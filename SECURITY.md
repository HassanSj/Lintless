# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[your.email@example.com](mailto:your.email@example.com)**. You will receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

Please include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Security Best Practices

When using this application:

1. **Never commit secrets**: Always use environment variables for API keys, tokens, and passwords
2. **Keep dependencies updated**: Regularly update npm packages to receive security patches
3. **Use strong passwords**: Enforce strong password policies for user accounts
4. **Enable HTTPS**: Always use HTTPS in production
5. **Review code**: Regularly review code for security vulnerabilities
6. **Monitor logs**: Keep an eye on application logs for suspicious activity

## Known Security Considerations

- JWT tokens should be stored securely (not in localStorage for production - consider httpOnly cookies)
- Rate limiting is implemented but should be tuned based on your use case
- OpenAI API keys must be kept secret and never exposed to the frontend
- MongoDB connection strings should use authentication in production
- Redis should be password-protected in production environments

