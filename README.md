# Secure Middleware

A collection of middleware packages for threat detection in different web frameworks.

## Project Structure

```
middleware/
├── packages/
│   ├── core/       # Core middleware functionality
│   ├── express/    # Express middleware wrapper
│   └── nest/       # NestJS middleware wrapper
└── apps/
    └── nest-api/   # Example NestJS application
```

## Installation

Install all dependencies from the root directory:

```bash
npm install
```

Start dynamic builds (watch mode) for all packages.
```bash
tsc -b -w
```

## Troubleshooting
If you encounter build issues, try cleaning the build cache.
```bash
tsc -b --clean
```

## Running the Example API

Navigate to the NestJS example application:

```bash
cd apps/nest-api
npm install
npm run start:nodemon
```

## Usage

Import and use the middleware in your application based on your framework:

- For NestJS: `@middleware/nest`
- For Express: `@middleware/express`

Refer to each package's documentation for detailed implementation instructions.
