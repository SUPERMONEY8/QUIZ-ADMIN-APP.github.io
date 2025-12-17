# Help System Documentation

## Overview

The Depo Help System provides comprehensive in-app documentation, tooltips, and user support features.

## Features

### ✅ Implemented

1. **In-App Help Tooltips**
   - Question mark icons next to form fields
   - Hover/click to show contextual help
   - Positioned tooltips (top, bottom, left, right)
   - Auto-dismiss on mouse leave

2. **Help Page**
   - Accessible from sidebar menu
   - Multiple sections: Getting Started, Features, Shortcuts, FAQ, Troubleshooting, Contact
   - Language switching (English, Arabic, French)
   - Responsive design

3. **Getting Started Guide**
   - First-time setup instructions
   - Adding first product
   - Making first sale
   - Step-by-step walkthrough

4. **Feature Documentation**
   - Complete guide for each module
   - How-to instructions
   - Tips and tricks
   - Best practices

5. **Keyboard Shortcuts**
   - Complete list of shortcuts
   - Visual keyboard display
   - Quick reference

6. **FAQ Section**
   - Common questions and answers
   - Accordion-style interface
   - Searchable (future enhancement)

7. **Troubleshooting Guide**
   - Common issues and solutions
   - Step-by-step fixes
   - Contact support information

8. **Contact Support**
   - Email address
   - Website link
   - Support hours

9. **Multilingual Support**
   - English (en)
   - Arabic (ar)
   - French (fr)
   - Easy to add more languages

10. **User Manual**
    - Comprehensive USER-MANUAL.md
    - Covers all features
    - PDF generation script (placeholder)

## Usage

### Adding Help Tooltips

Add tooltips to any element:

```html
<!-- Automatic tooltip from data-help attribute -->
<input type="text" data-help="help.products.name" />

<!-- Or programmatically -->
<script>
  helpSystem.addTooltip(element, 'help.products.name', 'top');
</script>
```

### Opening Help Page

```javascript
// From code
helpSystem.showHelpPage();

// Or navigate
router.navigate('/help');
```

### Changing Language

```javascript
helpSystem.setLanguage('ar'); // Arabic
helpSystem.setLanguage('fr'); // French
helpSystem.setLanguage('en'); // English
```

## File Structure

```
src/
├── components/
│   └── HelpSystem.js          # Main help system component
├── pages/
│   └── help.js                # Help page implementation
├── i18n/
│   ├── en.json                # English translations
│   ├── ar.json                # Arabic translations
│   └── fr.json                # French translations
└── assets/
    └── css/
        └── help.css           # Help system styles

USER-MANUAL.md                  # Complete user manual
scripts/
└── generate-pdf-manual.js     # PDF generation script
```

## Translation Keys

All help content uses translation keys. Add new content by:

1. Adding key to `src/i18n/en.json`
2. Translating to `src/i18n/ar.json` and `src/i18n/fr.json`
3. Using the key in code: `helpSystem.t('help.your.key')`

## Adding New Languages

1. Create `src/i18n/[lang].json`
2. Copy structure from `en.json`
3. Translate all values
4. Update language selector in help page

## PDF Manual

The PDF manual can be generated using:
- Markdown to PDF converters
- Online tools
- Script: `scripts/generate-pdf-manual.js` (requires setup)

For now, users can:
- View manual in-app (Help page)
- Open USER-MANUAL.md in markdown viewer
- Use online markdown to PDF converters

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F1` | Open help page |
| `Ctrl + /` | Show keyboard shortcuts |
| `Esc` | Close help modals/tooltips |

## Future Enhancements

- [ ] Video tutorials integration
- [ ] Interactive tutorials
- [ ] Search functionality in help
- [ ] Context-sensitive help
- [ ] Help analytics
- [ ] User feedback system
- [ ] PDF generation automation
- [ ] More languages

## Support

For help system issues or improvements:
- Email: support@depo.app
- Check USER-MANUAL.md for user-facing documentation

