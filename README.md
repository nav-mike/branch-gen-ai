# Branch Gen

A browser extension that generates git branch names from Linear task titles using Gemini AI, following GitFlow conventions.

## Features

- Automatically extracts task titles from Linear
- Generates branch names using GitFlow conventions (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `style/`, `test/`, `perf/`, `ci/`, `build/`, `revert/`)
- Works on Firefox
- Simple popup interface to copy generated branch names

## Installation

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select any file in the `branch-gen` directory

## Configuration

1. Click the extension icon in your browser toolbar
2. Go to "Options" to configure your settings
3. Enter your Gemini API key
4. Click Save

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Usage

1. Open a Linear task in your browser
2. Click the Branch Gen extension icon
3. The branch name will be generated and displayed in the popup
4. Click to copy the branch name

## Permissions

- `activeTab` - Access the current tab to read task information
- `storage` - Save your API key locally
- `https://generativelanguage.googleapis.com/*` - Communicate with Gemini API

## License

MIT
